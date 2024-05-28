<?php

declare(strict_types=1);

namespace App\ApiClient;

use App\ApiResource\Supervisor;
use App\DTO\CallDTO;
use App\DTO\CallInterface;
use App\DTO\ChangedProcesses;
use App\DTO\Config;
use App\DTO\MultiCallDTO;
use App\DTO\OperationResult;
use App\DTO\ProcessLog;
use App\DTO\ResponseDTO;
use App\DTO\SupervisorServer;
use App\Exception\BaseException;
use App\Service\XmlRpcEncoder;
use LogicException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\Response\CurlResponse;
use Symfony\Contracts\HttpClient\Exception\ExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final readonly class SupervisorApiClient
{
    private XmlRpcEncoder $encoder;

    public function __construct(private LoggerInterface $logger, private HttpClientInterface $client)
    {
        $this->encoder = new XmlRpcEncoder();
    }

    public function getAllProcessInfo(SupervisorServer $server): Supervisor
    {
        try {
            $version = $this->getSupervisorVersion($server);
            $data = $this->request(CallDTO::getAllProcessInfo(), $server)->getValue();

            return Supervisor::fromArray(data: $data, version: $version, server: $server);
        } catch (BaseException $e) {
            return Supervisor::fail($server, $e->getMessage());
        }
    }

    public function getSupervisorVersion(SupervisorServer $server): string
    {
        return $this->request(CallDTO::getSupervisorVersion(), $server)->string();
    }

    /** @param array<string, mixed> $options */
    private function request(CallInterface $call, SupervisorServer $server, array $options = []): ResponseDTO
    {
        if ($call instanceof MultiCallDTO) {
            $call = $this->convertMultiCallToCall($call);
        }
        if (!$call instanceof CallDTO) {
            throw new LogicException('Call should be instance of CallDTO');
        }

        $body = $this->encoder->encodeCallForSupervisor($call);

        try {
            $response = $this->client->request(
                'POST',
                $server->getUrl(),
                ['body' => $body] + $this->getOptions($server) + $options
            );

            return $this->encoder->decodeResponse($response->getContent());
        } catch (ExceptionInterface $e) {
            $errContent = null;
            if (method_exists($e, 'getResponse')) {
                /** @var CurlResponse $response */
                $response = $e->getResponse();
                $errContent = $response->getContent(false);
            }

            $message = $e->getMessage();
            if (null !== $errContent) {
                $message .= ' - '.$errContent;
            }

            $this->logger->error($message, ['exception' => $e]);

            return new ResponseDTO(
                value: [
                    'faultCode' => 1,
                    'faultString' => $message,
                ],
                isFault: true
            );
        }
    }

    private function convertMultiCallToCall(MultiCallDTO $call): CallDTO
    {
        $params = [];
        foreach ($call->calls as $item) {
            $paramsInternal = $item->params;
            if (!is_array($paramsInternal)) {
                throw new LogicException('Params should be array');
            }

            $builtParams = [];
            foreach ($paramsInternal as $value) {
                $enc = $this->encoder->encodeValue($value);
                if (count(array_keys($enc)) !== 1) {
                    throw new LogicException('Should be only one key encoded value');
                }

                /** @var string $key */
                $key = key($enc);

                $builtParams[] = $enc[$key];
            }

            $params[] = ['methodName' => $item->methodName, 'params' => $builtParams];
        }

        return new CallDTO("system.multicall", [$params]);
    }

    /** @return array<string, mixed> */
    private function getOptions(SupervisorServer $server): array
    {
        $options = [
            'timeout' => 60,
        ];

        if (null !== $server->username && null !== $server->password) {
            $options['auth_basic'] = [$server->username, $server->password];
        }

        return $options;
    }

    public function restartProcess(string $name, SupervisorServer $server): OperationResult
    {
        $response = $this->request(
            call: new MultiCallDTO(
                calls: [
                    CallDTO::stopProcess($name),
                    CallDTO::startProcess($name),
                ],
            ),
            server: $server
        );

        if ($response->isFault()) {
            return new OperationResult(false, true, $response->getFault()->message);
        }

        $ok = true;
        foreach ($response->boolArray() as $bool) {
            if (!$bool) {
                $ok = false;
                break;
            }
        }

        return new OperationResult($ok);
    }

    public function stopProcess(string $name, SupervisorServer $server): OperationResult
    {
        return OperationResult::fromBooleanResponse($this->request(CallDTO::stopProcess($name), $server));
    }

    public function startProcess(string $name, SupervisorServer $server): OperationResult
    {
        return OperationResult::fromBooleanResponse(
            response: $this->request(
                call: CallDTO::startProcess(name: $name),
                server: $server
            )
        );
    }

    public function restartProcessGroup(string $name, SupervisorServer $server): OperationResult
    {
        $response = $this->request(
            call: new MultiCallDTO(
                calls: [
                    CallDTO::stopProcessGroup($name),
                    CallDTO::startProcessGroup($name),
                ]
            ),
            server: $server
        );

        if ($response->isFault()) {
            return new OperationResult(ok: false, isFault: true, error: $response->getFault()->message);
        }

        return new OperationResult(ok: true);
    }

    public function stopProcessGroup(string $name, SupervisorServer $server): OperationResult
    {
        $result = $this->request(CallDTO::stopProcessGroup($name), $server);

        return new OperationResult(
            ok: !$result->isFault,
            isFault: $result->isFault,
            error: $result->isFault ? $result->getFault()->message : null
        );
    }

    public function startProcessGroup(string $name, SupervisorServer $server): OperationResult
    {
        $result = $this->request(CallDTO::startProcessGroup($name), $server);

        return new OperationResult(
            ok: !$result->isFault,
            isFault: $result->isFault,
            error: $result->isFault ? $result->getFault()->message : null
        );
    }

    public function restartAllProcesses(SupervisorServer $server): OperationResult
    {
        $response = $this->request(
            call: new MultiCallDTO(
                calls: [
                    CallDTO::stopAllProcesses(),
                    CallDTO::startAllProcesses(),
                ]
            ),
            server: $server
        );

        if ($response->isFault()) {
            return new OperationResult(false, true, $response->getFault()->message);
        }

        return new OperationResult(true);
    }

    public function stopAllProcesses(SupervisorServer $server): ChangedProcesses
    {
        return ChangedProcesses::fromResponse(
            response: $this->request(
                call: CallDTO::stopAllProcesses(),
                server: $server
            )
        );
    }

    public function startAllProcesses(SupervisorServer $server): ChangedProcesses
    {
        return ChangedProcesses::fromResponse(
            response: $this->request(
                call: CallDTO::startAllProcesses(),
                server: $server
            )
        );
    }

    public function readProcessStderrLog(string $name, int $offset, int $length, SupervisorServer $server): ?ProcessLog
    {
        return ProcessLog::fromResponse(
            response: $this->request(
                call: CallDTO::readProcessStderrLog(name: $name, offset: $offset, length: $length),
                server: $server
            )
        );
    }

    public function clearProcessLogs(string $name, SupervisorServer $server): OperationResult
    {
        return OperationResult::fromBooleanResponse(
            response: $this->request(
                call: CallDTO::clearProcessLogs(name: $name),
                server: $server
            )
        );
    }

    public function clearAllProcessLogs(SupervisorServer $server): ChangedProcesses
    {
        return ChangedProcesses::fromResponse(
            response: $this->request(
                call: CallDTO::clearAllProcessLogs(),
                server: $server,
                options: ['timeout' => 60 * 5]
            )
        );
    }

    /** @return string[] */
    public function listMethods(SupervisorServer $server): array
    {
        return $this->request(call: CallDTO::listMethods(), server: $server)->arrayOfStrings();
    }

    /** @return string[] */
    public function methodSignature(string $method, SupervisorServer $server): array
    {
        return $this->request(call: CallDTO::methodSignature(method: $method), server: $server)->arrayOfStrings();
    }

    public function methodHelp(string $method, SupervisorServer $server): string
    {
        return $this->request(call: CallDTO::methodHelp($method), server: $server)->string();
    }

    /**
     * High level
     */
    public function cloneProcess(string $name, string $group, SupervisorServer $server): OperationResult
    {
        foreach ($this->getAllConfigInfo($server) as $config) {
            if ($config->group === $group) {
                return $this->addProgramToGroup(
                    group: $config->group,
                    program: $name.'_'.time(),
                    config: $config,
                    server: $server
                );
            }
        }

        throw new LogicException("Group $group not found");
    }

    /** @return Config[] */
    public function getAllConfigInfo(SupervisorServer $server): array
    {
        return Config::fromResponseArray(response: $this->request(call: CallDTO::getAllConfigInfo(), server: $server));
    }

    public function addProgramToGroup(
        string $group,
        string $program,
        Config $config,
        SupervisorServer $server
    ): OperationResult {
        $call = CallDTO::addProgramToGroup(group: $group, program: $program, config: $config);

        return OperationResult::fromBooleanResponse(response: $this->request(call: $call, server: $server));
    }

    /**
     * High level
     */
    public function removeProcess(string $name, string $group, SupervisorServer $server): OperationResult
    {
        $this->stopProcess(name: $name, server: $server);

        return $this->removeProcessFromGroup(group: $group, program: $name, server: $server);
    }

    public function removeProcessFromGroup(string $group, string $program, SupervisorServer $server): OperationResult
    {
        $call = CallDTO::removeProcessFromGroup(group: $group, program: $program);

        return OperationResult::fromBooleanResponse(response: $this->request(call: $call, server: $server));
    }

    public function readProcessStdoutLog(string $name, int $offset, int $length, SupervisorServer $server): ?ProcessLog
    {
        $call = CallDTO::readProcessStdoutLog(name: $name, offset: $offset, length: $length);

        return ProcessLog::fromResponse(response: $this->request(call: $call, server: $server));
    }
}
