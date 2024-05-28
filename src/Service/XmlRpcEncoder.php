<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\CallDTO;
use App\DTO\CallInterface;
use App\DTO\FaultDTO;
use App\DTO\MultiCallDTO;
use App\DTO\ResponseDTO;
use App\Exception\XmlRpcException;
use DateTime;
use LogicException;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

/**
 * @template V of array{
 *     string?: string,
 *     int?: string,
 *     i4?: string,
 *     double?: string,
 *     boolean?: string,
 *     base64?: string,
 *     "dateTime.iso8601"?: string,
 *     nil?: null,
 *     "ex.nil"?: null,
 *     array?: array<string, mixed>,
 *     struct?: array{member: array{name: string, value: V}[]},
 * }
 */
final readonly class XmlRpcEncoder
{
    public function __construct(private XmlEncoder $xmlEncoder = new XmlEncoder()) {}

    public function decodeCall(string $request): CallInterface
    {
        /** @var array{methodName?: string, params: mixed} $data */
        $data = $this->decode($request);
        if (!isset($data['methodName'])) {
            throw new XmlRpcException("Uncomprensible request");
        }
        $methodName = $data['methodName'];

        if ($methodName === "system.multicall") {
            return new MultiCallDTO($this->multiCallDecode($data));
        }

        $params = [];
        if ($data['params'] !== "") {
            /** @var array{param: array<int|string, mixed>} $dataParams */
            $dataParams = $data['params'];
            /**
             * @var int|string $key
             * @var array<string, mixed> $param
             */
            foreach ($dataParams['param'] as $key => $param) {
                if ($key === 'value') {
                    $result = $this->decodeValue($param);
                    if (is_array($result)) {
                        /**
                         * @var int|string $decodedKey
                         * @var mixed $res
                         */
                        foreach ($result as $decodedKey => $res) {
                            if (is_int($decodedKey)) {
                                $params[] = $res;
                                continue;
                            }
                            if (isset($params[$decodedKey])) {
                                throw new XmlRpcException("Already set parameter $decodedKey");
                            }
                            $params[$decodedKey] = $res;
                        }
                        continue;
                    }

                    $params[] = $result;
                    continue;
                }

                /** @var array{value: array<string, mixed>} $param */
                $params[] = $this->decodeValue($param['value']);
            }
        }

        return new CallDTO($methodName, $params);
    }

    private function decode(string $data): mixed
    {
        try {
            $decoded = $this->xmlEncoder->decode($data, '');
            if ($decoded === false) {
                throw new XmlRpcException("Not a valid XMLRPC call");
            }

            return $decoded;
        } catch (NotEncodableValueException $e) {
            throw new XmlRpcException("Not a valid XML-RPC response", 0, $e);
        }
    }

    /**
     * @param array<string, mixed> $input
     * @return CallDTO[]
     */
    private function multiCallDecode(array $input): array
    {
        /** @var CallDTO[] $data */
        $data = [];

        /** @var array{params: array{param: array{value: array{array?: array<string, mixed>}}}} $input */
        $calls = $input['params']['param']['value'];
        if (count($calls) !== 1) {
            throw new XmlRpcException("Invalid multicall request");
        }

        /** @var array{methodName?: string, params?: array<string, mixed>}[] $callsDecoded */
        $callsDecoded = $this->decodeArray($calls['array']);
        foreach ($callsDecoded as $call) {
            if (!(isset($call['methodName'], $call['params']))) {
                continue; // Skip invalid call
            }

            $data[] = new CallDTO($call['methodName'], $call['params']);
        }

        return $data;
    }

    /**
     * @param array<string, mixed> $field
     * @return array<int, mixed>
     */
    private function decodeArray(array $field): array
    {
        /** @var array{data?: array{value?: V[]}} $field */
        if (!isset($field['data']['value'])) {
            return [];
        }

        /** @var array<int, mixed> $data */
        $data = [];
        foreach ($field['data']['value'] as $key => $value) {
            $data[] = is_int($key) ? $this->decodeValue($value) : $this->decodeValue([$key => $value]);
        }

        return $data;
    }

    /**
     * @param array<string, mixed> $value
     * @return int|float|string|bool|array<int, mixed>|array<string, mixed>|null
     */
    private function decodeValue(array $value): int|float|string|bool|array|null
    {
        /** @var V $value */
        if (count($value) != 1) {
            throw new XmlRpcException("Cannot decode value: invalid value element");
        }

        return match (true) {
            isset($value['nil']), isset($value['ex.nil']) => null,
            isset($value['int']) => filter_var($value['int'], FILTER_VALIDATE_INT),
            isset($value['i4']) => filter_var($value['i4'], FILTER_VALIDATE_INT),
            isset($value['double']) => (float)$value['double'],
            isset($value['boolean']) => filter_var($value['boolean'], FILTER_VALIDATE_BOOLEAN),
            isset($value['base64']) => base64_decode($value['base64']),
            isset($value['dateTime.iso8601']) => $this->decodeIso8601Datetime($value['dateTime.iso8601']),
            isset($value['string']) => $value['string'],
            isset($value['array']) => $this->decodeArray($value['array']),
            isset($value['struct']) => $this->decodeStruct($value['struct']),
            default => throw new XmlRpcException("Cannot decode value: invalid value element")
        };
    }

    private function decodeIso8601Datetime(string $field): int
    {
        $time = strtotime($field);
        if (false === $time) {
            throw new XmlRpcException("Not a valid datetime");
        }

        return $time;
    }

    /**
     * @param array<string, mixed> $field
     * @return array<string, mixed>
     */
    private function decodeStruct(array $field): array
    {
        /** @var array{member: array<string, mixed>} $field */

        if (isset($field['member']['name'])) {
            /** @var array{name: string, value: V} $member */
            $member = $field['member'];

            return [$member['name'] => $this->decodeValue($member['value'])];
        }

        /** @var array<string, mixed> $data */
        $data = [];
        foreach ($field['member'] as $member) {
            /** @var array{name: string, value: V} $member */
            $data[$member['name']] = $this->decodeValue($member['value']);
        }

        return $data;
    }

    public function decodeMultiCall(string $request): MultiCallDTO
    {
        /** @var array{methodName?: string, params: array{param: array{value: array{data: array{value: V[]}}[]}}}|false $data */
        $data = $this->decode($request);

        if (!isset($data['methodName'])) {
            throw new XmlRpcException("Uncomprensible multicall request");
        }

        if ($data['methodName'] !== "system.multicall") {
            throw new XmlRpcException("Invalid multicall request");
        }

        return new MultiCallDTO($this->multiCallDecode($data));
    }

    public function decodeResponse(string $response): ResponseDTO
    {
        /** @var array{fault?: array{value: V}, params?: array{param: array{value: V}}} $data */
        $data = $this->decode($response);

        if (isset($data['fault']['value'])) {
            return new ResponseDTO($this->decodeValue($data['fault']['value']), true);
        } elseif (isset($data['params']['param'])) {
            return new ResponseDTO($this->decodeValue($data['params']['param']['value']));
        } else {
            throw new XmlRpcException("Not a valid XML-RPC response");
        }
    }

    public function encodeError(FaultDTO $fault): string
    {
        $data = ['faultCode' => $fault->code, 'faultString' => $fault->message];
        $response = ['fault' => ['value' => $this->encodeValue($data)]];

        return $this->encode($response, 'methodResponse');
    }

    /** @return array<int|string, mixed> */
    public function encodeValue(mixed $data): array
    {
        return match (gettype($data)) {
            'NULL' => ['nil' => null],
            'array' => $this->encodeArrayOrStruct($data),
            'boolean' => ['boolean' => $data ? 1 : 0],
            'double' => ['double' => $data],
            'integer' => ['int' => $data],
            'object' => $this->encodeObject($data),
            'string' => ['string' => $data],
            default => throw new XmlRpcException("Unknown type for encoding")
        };
    }

    /**
     * @param array<string, mixed> $value
     * @return array<string|int, mixed>
     */
    private function encodeArrayOrStruct(array $value): array
    {
        $counter = count($value);
        for ($i = 0; $i < $counter; $i++) {
            if (!array_key_exists($i, $value)) {
                // As struct
                if (count($value) === 1) {
                    foreach ($value as $k => $v) {
                        return ['struct' => ['member' => ['name' => $k, 'value' => $this->encodeValue($v)]]];
                    }
                }

                $data = [];
                foreach ($value as $k => $v) {
                    $data[] = ['name' => $k, 'value' => $this->encodeValue($v)];
                }

                return ['struct' => ['member' => $data]];
            }
        }

        // As array
        if (count($value) === 1) {
            foreach ($value as $entry) {
                return ['array' => ['data' => ['value' => $this->encodeValue($entry)]]];
            }
        }

        $data = [];
        foreach ($value as $entry) {
            $data[] = $this->encodeValue($entry);
        }

        return ['array' => ['data' => ['value' => $data]]];
    }

    /**
     * @param object $value
     * @return array<string, string>
     */
    private function encodeObject(mixed $value): array
    {
        if ($value instanceof DateTime) {
            return ['dateTime.iso8601' => date("Ymd\TH:i:s", (int)$value->format('U'))];
        } else {
            throw new XmlRpcException("Unknown object type to be encoded");
        }
    }

    private function encode(mixed $data, string $rootNodeName): string
    {
        return $this->xmlEncoder->encode($data, 'xml', [XmlEncoder::ROOT_NODE_NAME => $rootNodeName]);
    }

    public function encodeMultiCall(MultiCallDTO $input): string
    {
        return $this->encodeCall(new CallDTO("system.multicall", $input->toArray()));
    }

    public function encodeCall(CallDTO $call): string
    {
        $values = $params = [];
        foreach ($call->getParams() as $item) {
            if (empty($item)) {
                continue;
            }

            $values[] = ['value' => $this->encodeValue($item)];
        }

        if ($values !== []) {
            $params = ['param' => $values];
        }

        return $this->encode(['methodName' => $call->methodName, 'params' => $params], 'methodCall');
    }

    public function encodeResponse(ResponseDTO $response): string
    {
        $data = ['params' => ['param' => ['value' => $this->encodeValue($response->value)]]];

        return $this->encode($data, 'methodResponse');
    }

    /** @return array<string, mixed> */
    public function normalizeCallForSupervisor(CallDTO $call): array
    {
        $params = $call->params;
        if (!is_array($params)) {
            throw new LogicException('Params should be array');
        }

        $builtParams = [];
        foreach ($params as $value) {
            $enc = $this->encodeValue($value);
            if (count(array_keys($enc)) !== 1) {
                throw new LogicException('Should be only one key encoded value');
            }

            /** @var string $key */
            $key = key($enc);

            if (!isset($builtParams[$key])) {
                $builtParams[$key] = [];
            }

            $builtParams[$key][] = $enc[$key];
        }

        return ['methodName' => $call->methodName, 'params' => $builtParams];
    }

    /**
     * Special method for supervisor calls encode
     * See also venv/lib/python3.11/site-packages/supervisor/xmlrpc.py:350
     */
    public function encodeCallForSupervisor(CallDTO $call): string
    {
        return $this->encode($this->normalizeCallForSupervisor($call), 'methodCall');
    }
}
