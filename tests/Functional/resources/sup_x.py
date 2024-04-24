import datetime
import json
import re
import time
import traceback
import types
from xml.etree.ElementTree import iterparse

try:  # pragma: no cover
    from base64 import decodebytes as decodestring, encodebytes as encodestring
except ImportError:  # pragma: no cover
    from base64 import decodestring, encodestring


class Faults:
    UNKNOWN_METHOD = 1
    INCORRECT_PARAMETERS = 2
    BAD_ARGUMENTS = 3
    SIGNATURE_UNSUPPORTED = 4
    SHUTDOWN_STATE = 6
    BAD_NAME = 10
    BAD_SIGNAL = 11
    NO_FILE = 20
    NOT_EXECUTABLE = 21
    FAILED = 30
    ABNORMAL_TERMINATION = 40
    SPAWN_ERROR = 50
    ALREADY_STARTED = 60
    NOT_RUNNING = 70
    SUCCESS = 80
    ALREADY_ADDED = 90
    STILL_RUNNING = 91
    CANT_REREAD = 92


def getFaultDescription(code):
    for faultname in Faults.__dict__:
        if getattr(Faults, faultname) == code:
            return faultname
    return 'UNKNOWN'


class RPCError(Exception):
    def __init__(self, code, extra=None):
        self.code = code
        self.text = getFaultDescription(code)
        if extra is not None:
            self.text = '%s: %s' % (self.text, extra)

    def __str__(self):
        return 'code=%r, text=%r' % (self.code, self.text)


class NOT_DONE_YET:
    pass


class simple_producer:
    """producer for a string"""

    def __init__(self, data, buffer_size=1024):
        self.data = data
        self.buffer_size = buffer_size

    def more(self):
        if len(self.data) > self.buffer_size:
            result = self.data[:self.buffer_size]
            self.data = self.data[self.buffer_size:]
            return result
        else:
            result = self.data
            self.data = b''
            return result


def get_header(head_reg, lines, group=1):
    for line in lines:
        m = head_reg.match(line)
        if m and m.end() == len(line):
            return m.group(group)
    return ''


try:  # pragma: no cover
    from StringIO import StringIO
except ImportError:  # pragma: no cover
    from io import StringIO


class composite_producer:
    """combine a fifo of producers into one"""

    def __init__(self, producers):
        self.producers = producers

    def more(self):
        while len(self.producers):
            p = self.producers[0]
            d = p.more()
            if d:
                return d
            else:
                self.producers.pop(0)
        else:
            return b''


class globbing_producer:
    """
    'glob' the output from a producer into a particular buffer size.
    helps reduce the number of calls to send().  [this appears to
    gain about 30% performance on requests to a single channel]
    """

    def __init__(self, producer, buffer_size=1 << 16):
        self.producer = producer
        self.buffer = b''
        self.buffer_size = buffer_size

    def more(self):
        while len(self.buffer) < self.buffer_size:
            data = self.producer.more()
            if data:
                self.buffer = self.buffer + data
            else:
                break
        r = self.buffer
        self.buffer = b''
        return r


class hooked_producer:
    """
    A producer that will call <function> when it empties,.
    with an argument of the number of bytes produced.  Useful
    for logging/instrumentation purposes.
    """

    def __init__(self, producer, function):
        self.producer = producer
        self.function = function
        self.bytes = 0

    def more(self):
        if self.producer:
            result = self.producer.more()
            if not result:
                self.producer = None
                self.function(self.bytes)
            else:
                self.bytes += len(result)
            return result
        else:
            return ''


class DeferredXMLRPCResponse:
    """ A medusa producer that implements a deferred callback; requires
    a subclass of asynchat.async_chat that handles NOT_DONE_YET sentinel """
    CONNECTION = re.compile('Connection: (.*)', re.IGNORECASE)

    def __init__(self, request, callback):
        self.callback = callback
        self.request = request
        self.finished = False
        self.delay = float(callback.delay)

    def more(self):
        if self.finished:
            return ''
        try:
            try:
                value = self.callback()
                if value is NOT_DONE_YET:
                    return NOT_DONE_YET
            except RPCError as err:
                value = xmlrpclib.Fault(err.code, err.text)

            body = xmlrpc_marshal(value)

            self.finished = True

            return self.getresponse(body)

        except:
            tb = traceback.format_exc()
            self.request.channel.server.logger.log(
                "XML-RPC response callback error", tb
            )
            self.finished = True
            self.request.error(500)

    def getresponse(self, body):
        self.request['Content-Type'] = 'text/xml'
        self.request['Content-Length'] = len(body)
        self.request.push(body)
        connection = get_header(self.CONNECTION, self.request.header)

        close_it = 0

        if self.request.version == '1.0':
            if connection == 'keep-alive':
                self.request['Connection'] = 'Keep-Alive'
            else:
                close_it = 1
        elif self.request.version == '1.1':
            if connection == 'close':
                close_it = 1
        elif self.request.version is None:
            close_it = 1

        outgoing_header = simple_producer(
            self.request.build_reply_header())

        if close_it:
            self.request['Connection'] = 'close'

        # prepend the header
        self.request.outgoing.insert(0, outgoing_header)
        outgoing_producer = composite_producer(self.request.outgoing)

        # apply a few final transformations to the output
        self.request.channel.push_with_producer(
            # globbing gives us large packets
            globbing_producer(
                # hooking lets us log the number of bytes sent
                hooked_producer(
                    outgoing_producer,
                    self.request.log
                )
            )
        )

        self.request.channel.current_request = None

        if close_it:
            self.request.channel.close_when_done()


def make_datetime(text):
    return datetime.datetime(
        *time.strptime(text, "%Y%m%dT%H:%M:%S")[:6]
    )


def as_string(s, encoding='utf8'):
    if isinstance(s, str):
        return s
    else:
        return s.decode(encoding)


def as_bytes(s, encoding='utf8'):
    if isinstance(s, bytes):
        return s
    else:
        return s.encode(encoding)


try:  # pragma: no cover
    import xmlrpc.client as xmlrpclib
except ImportError:  # pragma: no cover
    import xmlrpclib


def xmlrpc_marshal(value):
    ismethodresponse = not isinstance(value, xmlrpclib.Fault)
    if ismethodresponse:
        if not isinstance(value, tuple):
            value = (value,)
        body = xmlrpclib.dumps(value, methodresponse=ismethodresponse)
    else:
        body = xmlrpclib.dumps(value)
    return body


class supervisor_xmlrpc_handler():
    path = '/RPC2'
    IDENT = 'Supervisor XML-RPC Handler'

    unmarshallers = {
        "int": lambda x: int(x.text),
        "i4": lambda x: int(x.text),
        "boolean": lambda x: x.text == "1",
        "string": lambda x: x.text or "",
        "double": lambda x: float(x.text),
        "dateTime.iso8601": lambda x: make_datetime(x.text),
        "array": lambda x: x[0].text,
        "data": lambda x: [v.text for v in x],
        "struct": lambda x: dict([(k.text or "", v.text) for k, v in x]),
        "base64": lambda x: as_string(decodestring(as_bytes(x.text or ""))),
        "param": lambda x: x[0].text,
    }

    def loads(self, data):
        params = method = None
        for action, elem in iterparse(StringIO(data)):
            unmarshall = self.unmarshallers.get(elem.tag)
            if unmarshall:
                data = unmarshall(elem)
                elem.clear()
                elem.text = data
            elif elem.tag == "value":
                try:
                    data = elem[0].text
                except IndexError:
                    data = elem.text or ""
                elem.clear()
                elem.text = data
            elif elem.tag == "methodName":
                method = elem.text
            elif elem.tag == "params":
                params = tuple([v.text for v in elem])
        return params, method

    def match(self, request):
        return request.uri.startswith(self.path)

    def continue_request(self, data, request):
        logger = self.supervisord.options.logger

        try:
            try:
                # on 2.x, the Expat parser doesn't like Unicode which actually
                # contains non-ASCII characters. It's a bit of a kludge to
                # do it conditionally here, but it's down to how underlying
                # libs behave
                # if PY2:
                #     data = data.encode('ascii', 'xmlcharrefreplace')
                params, method = self.loads(data)
                print(data)
            except:
                logger.error(
                    'XML-RPC request data %r is invalid: unmarshallable' %
                    (data,)
                )
                request.error(400)
                return

            # no <methodName> in the request or name is an empty string
            if not method:
                logger.error(
                    'XML-RPC request data %r is invalid: no method name' %
                    (data,)
                )
                request.error(400)
                return

            # we allow xml-rpc clients that do not send empty <params>
            # when there are no parameters for the method call
            if params is None:
                params = ()

            try:
                logger.trace('XML-RPC method called: %s()' % method)
                print(params)
                value = self.call(method, params)
                logger.trace('XML-RPC method %s() returned successfully' %
                             method)
            except RPCError as err:
                # turn RPCError reported by method into a Fault instance
                value = xmlrpclib.Fault(err.code, err.text)
                logger.trace('XML-RPC method %s() returned fault: [%d] %s' % (
                    method,
                    err.code, err.text))

            if isinstance(value, types.FunctionType):
                # returning a function from an RPC method implies that
                # this needs to be a deferred response (it needs to block).
                pushproducer = request.channel.push_with_producer
                pushproducer(DeferredXMLRPCResponse(request, value))

            else:
                # if we get anything but a function, it implies that this
                # response doesn't need to be deferred, we can service it
                # right away.
                body = as_bytes(xmlrpc_marshal(value))
                request['Content-Type'] = 'text/xml'
                request['Content-Length'] = len(body)
                request.push(body)
                request.done()

        except:
            tb = traceback.format_exc()
            logger.critical(
                "Handling XML-RPC request with data %r raised an unexpected "
                "exception: %s" % (data, tb)
            )
            # internal error, report as HTTP server error
            request.error(500)

    def call(self, method, params):
        print(params)


def xmlrpc_marshal(value):
    # ismethodresponse = not isinstance(value, xmlrpclib.Fault)
    # if ismethodresponse:
    #     if not isinstance(value, tuple):
    #         value = (value,)
    #     body = xmlrpclib.dumps(value, methodresponse=ismethodresponse)
    # else:
    #     body = xmlrpclib.dumps(value)
    body = xmlrpclib.dumps(value['params'])
    return body


if __name__ == '__main__':
    h = supervisor_xmlrpc_handler()

    ddd = json.loads(
        '{"methodName":"twiddler.addProgramToGroup","params":{"group_name":"tail-f-void","program_name":"nginx","program_options":{"autostart":true,"directory":"none","uid":"none","command":"la","exitcodes":[0],"group":"tail-f-void","group_prio":10,"inuse":true,"killasgroup":false,"name":"nginx1","process_prio":10,"redirect_stderr":false,"startretries":3,"startsecs":1,"stdout_capture_maxbytes":0,"stdout_events_enabled":false,"stdout_logfile":"\/tmp\/tail-f-void-stdout---supervisor-y699eksx.log","stdout_logfile_backups":10,"stdout_logfile_maxbytes":52428800,"stdout_syslog":false,"stopsignal":3,"stopwaitsecs":10,"stderr_capture_maxbytes":0,"stderr_events_enabled":false,"stderr_logfile":"\/tmp\/tail-f-void-stderr---supervisor-xdbcn_bh.log","stderr_logfile_backups":10,"stderr_logfile_maxbytes":52428800,"stderr_syslog":false,"serverurl":"none"}}}')

    # ddd['params'] = tuple.__add__(ddd['params'])

    # list = [(k, v) for k, v in ddd['params'].items()]
    # list2 = tuple([])
    # for e in list:
    #     list2 = list2.__add__(e)

    list = [(k, v) for k, v in ddd['params'].items()]
    ddd['params'] = tuple(list)

    # ddd2 = xmlrpc_marshal(ddd)
    ddd2 = xmlrpclib.dumps(ddd['params'], ddd['methodName'])

    ddd3 = h.loads(ddd2)

    print(ddd3)
