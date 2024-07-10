<?php

declare(strict_types=1);

namespace App\Tests\Unit\XmlRpc;

use App\DTO\Supervisord\Config;
use App\DTO\XmlRpc\CallDTO;
use App\DTO\XmlRpc\FaultDTO;
use App\DTO\XmlRpc\MultiCallDTO;
use App\DTO\XmlRpc\ResponseDTO;
use App\Exception\XmlRpcException;
use App\Service\XmlRpcEncoder;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ReflectionMethod;
use Symfony\Component\Serializer\Encoder\XmlEncoder;

class XmlRpcTest extends TestCase
{
    public const string TESTS_ROOT = __DIR__.'/../..';

    public function testEncodeMethodCallListMethods(): void
    {
        $encoder = new XmlRpcEncoder();

        $call = $encoder->encodeCall(new CallDTO('system.listMethods'));

        $this->assertXmlStringEqualsXmlFile(__DIR__.'/resources/methodCall_listMethods.xml', $call);
    }

    public function testEncodeMethodResponseListMethods(): void
    {
        $methods = [
            'system.listMethods',
            'system.methodSignature',
            'system.methodHelp',
            'system.multicall',
            'system.shutdown',
            'sample.add',
        ];

        $encoder = new XmlRpcEncoder();

        $response = $encoder->encodeResponse(new ResponseDTO($methods));

        $this->assertXmlStringEqualsXmlFile(__DIR__.'/resources/methodResponse_listMethods.xml', $response);
    }

    public function testEncodeErrorResponse(): void
    {
        $encoder = new XmlRpcEncoder();

        $response = $encoder->encodeError(new FaultDTO(300, 'Invalid parameters'));

        $this->assertXmlStringEqualsXmlFile(__DIR__.'/resources/methodResponse_error.xml', $response);
    }

    public function testEncodeMultiCall(): void
    {
        $encoder = new XmlRpcEncoder();

        $calls = [
            new CallDTO('my.method', ['john']),
            new CallDTO('another.method', ['doe']),
        ];

        $response = $encoder->encodeMultiCall(new MultiCallDTO($calls));

        $this->assertXmlStringEqualsXmlFile(__DIR__.'/resources/methodCall_systemMulticall.xml', $response);
    }

    public function testEncodeMultiCallResponse(): void
    {
        $encoder = new XmlRpcEncoder();

        $response = [['success' => true], ['faultCode' => 300, 'faultString' => 'Invalid parameters'],];

        $values = $encoder->encodeResponse(new ResponseDTO($response));

        $this->assertXmlStringEqualsXmlFile(__DIR__.'/resources/methodResponse_systemMulticall.xml', $values);
    }

    public function testEncodeMultiCallSameMethodBug(): void
    {
        $encoder = new XmlRpcEncoder();

        $response = $encoder->encodeMultiCall(
            new MultiCallDTO([
                new CallDTO('my.method', ['john']),
                new CallDTO('my.method', ['doe']),
            ])
        );

        $this->assertXmlStringEqualsXmlFile(
            __DIR__.'/resources/methodCall_systemMulticall_same_method_bug.xml',
            $response
        );
    }

    public function testDecodeMethodCallListMethods(): void
    {
        $encoder = new XmlRpcEncoder();

        $data = file_get_contents(__DIR__.'/resources/methodCall_listMethods.xml');
        self::assertNotFalse($data);

        $decoded = $encoder->decodeCall($data);

        $this->assertInstanceOf(CallDTO::class, $decoded);

        $this->assertEquals('system.listMethods', $decoded->methodName);
    }

    public function testDecodeMethodResponseListMethods(): void
    {
        $methods = [
            'system.listMethods',
            'system.methodSignature',
            'system.methodHelp',
            'system.multicall',
            'system.shutdown',
            'sample.add',
        ];

        $encoder = new XmlRpcEncoder();

        $xml_data = file_get_contents(__DIR__.'/resources/methodResponse_listMethods.xml');
        self::assertNotFalse($xml_data);

        $response = $encoder->decodeResponse($xml_data);

        $this->assertIsArray($response->value);

        foreach ($response->value as $method) {
            $this->assertContains($method, $methods);
        }
    }

    public function testDecodeErrorResponse(): void
    {
        $encoder = new XmlRpcEncoder();

        $xml_data = file_get_contents(__DIR__.'/resources/methodResponse_error.xml');
        self::assertNotFalse($xml_data);

        $response = $encoder->decodeResponse($xml_data);

        $this->assertIsArray($response->value);

        $this->assertTrue($response->hasFault());
    }

    public function testDecodeMultiCallRequest(): void
    {
        $encoder = new XmlRpcEncoder();

        $data = file_get_contents(__DIR__.'/resources/methodCall_systemMulticall.xml');
        self::assertNotFalse($data);

        $decoded = $encoder->decodeCall($data);
        $this->assertInstanceOf(MultiCallDTO::class, $decoded);
        $this->assertCount(2, $decoded->calls);
    }

    public function testDecodeInvalidMultiCallRequest(): void
    {
        $encoder = new XmlRpcEncoder();

        $data = file_get_contents(__DIR__.'/resources/methodCall_invalidSystemMulticall.xml');
        self::assertNotFalse($data);

        $decoded = $encoder->decodeCall($data);

        $this->assertInstanceOf(MultiCallDTO::class, $decoded);
        $this->assertCount(1, $decoded->calls);
    }

    public function testDecodeMultiCallResponse(): void
    {
        $encoder = new XmlRpcEncoder();

        $data = file_get_contents(__DIR__.'/resources/methodResponse_systemMulticall.xml');
        self::assertNotFalse($data);

        $response = $encoder->decodeResponse($data);

        $this->assertIsArray($response->value);
    }

    public function testDecodeInvalidValue(): void
    {
        $this->expectException(XmlRpcException::class);

        $encoder = new XmlRpcEncoder();

        $data = file_get_contents(__DIR__.'/resources/methodResponse_invalid.xml');
        self::assertNotFalse($data);

        $encoder->decodeResponse($data);
    }

    public function testEncodeAndDecodeIntegrity(): void
    {
        $encoder = new XmlRpcEncoder();

        $payload = [
            'tag' => 'john',
            'data' => 123,
        ];

        $encoded = $encoder->encodeResponse(new ResponseDTO($payload));
        $response = $encoder->decodeResponse($encoded);

        $this->assertEquals($payload, $response->value);
    }

    public function testCallTransformationsResultsAreEqual(): void
    {
        $encoder = new XmlRpcEncoder(new XmlEncoder([XmlEncoder::FORMAT_OUTPUT => true]));

        $orig = CallDTO::stopProcess('a:a');
        $string = $encoder->encodeCall($orig);
        $decoded = $encoder->decodeCall($string);
        $this->assertEquals($orig, $decoded);

        $orig = CallDTO::readProcessStderrLog('a:a', 50, 1000);
        $string = $encoder->encodeCall($orig);
        $decoded = $encoder->decodeCall($string);
        $this->assertEquals($orig, $decoded);

        $orig = CallDTO::getAllProcessInfo();
        $string = $encoder->encodeCall($orig);
        $decoded = $encoder->decodeCall($string);
        $this->assertEquals($orig, $decoded);

        $orig = new MultiCallDTO([
            CallDTO::stopAllProcesses(),
            CallDTO::startAllProcesses(),
            CallDTO::stopProcess('aaa'),
        ]);
        $string = $encoder->encodeMultiCall($orig);
        $decoded = $encoder->decodeMultiCall($string);

        $this->assertEquals($orig, $decoded);
    }

    public function testResponseTransformationsResultsAreEqual(): void
    {
        $encoder = new XmlRpcEncoder(new XmlEncoder([XmlEncoder::FORMAT_OUTPUT => true]));

        $orig = new ResponseDTO([
            'success' => true,
            'value' => ['a', 'b', 'c'],
            'arr' => [1, 2, 3],
            'date' => 11,
            'a' => null,
        ]);
        $string = $encoder->encodeResponse($orig);
        $decoded = $encoder->decodeResponse($string);
        $this->assertEquals($orig, $decoded);
    }

    public function testEncoderForSupervisorWorksFine(): void
    {
        $good = '<?xml version="1.0"?>
<methodCall>
  <methodName>twiddler.addProgramToGroup</methodName>
  <params>
    <string>test</string>
    <string>test</string>
    <struct>
      <member>
        <name>command</name>
        <value>
          <string>test</string>
        </value>
      </member>
      <member>
        <name>autorestart</name>
        <value>
          <string>unexpected</string>
        </value>
      </member>
    </struct>
  </params>
</methodCall>
';
        $call = CallDTO::addProgramToGroup('test', 'test', new Config(command: 'test'));
        $mainEncoder = new XmlRpcEncoder(new XmlEncoder([XmlEncoder::FORMAT_OUTPUT => true]));

        $encoded = $mainEncoder->encodeCallForSupervisor($call);
        $this->assertEquals($good, $encoded);
    }

    public function testNewMethodsNotAdded(): void
    {
        $encoder = new XmlRpcEncoder(new XmlEncoder([XmlEncoder::FORMAT_OUTPUT => true]));
        $functions = [
            $encoder->__construct(...),
            $encoder->decodeCall(...),
            $encoder->decodeMultiCall(...),
            $encoder->decodeResponse(...),
            $encoder->encodeError(...),
            $encoder->encodeMultiCall(...),
            $encoder->encodeCall(...),
            $encoder->encodeResponse(...),
            $encoder->encodeCallForSupervisor(...),
        ];

        $ref = new ReflectionClass(XmlRpcEncoder::class);
        $refsMethods = $ref->getMethods(ReflectionMethod::IS_PUBLIC);
        $this->assertCount(count($functions), $refsMethods);
    }
}
