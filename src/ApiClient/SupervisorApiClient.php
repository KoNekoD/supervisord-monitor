<?php

declare(strict_types=1);

namespace App\ApiClient;

use App\ApiResource\Supervisor;
use App\DTO\CallDTO;
use App\DTO\CallInterface;
use App\DTO\ChangedProcesses;
use App\DTO\Config;
use App\DTO\FaultDTO;
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

    public function getSupervisor(SupervisorServer $server): Supervisor
    {
        try {
            $calls = [CallDTO::getSupervisorVersion(), CallDTO::getAllProcessInfo()];
            $response = $this->request(new MultiCallDTO(calls: $calls), $server);
            if ($response->hasFault()) {
                return Supervisor::fail($server, $response->getFirstFault()->message);
            }

            /** @var array{0: string, 1: array<string, mixed>} $data */
            $data = $response->getValue();

            $dto = Supervisor::fromArray(data: $data[1], version: $data[0], server: $server);

            $offset = -10000;
            $calls = [];
            foreach ($dto->processes as $process) {
                $name = $process->getFullProcessName();
                $calls[] = CallDTO::readProcessStdoutLog(name: $name, offset: $offset, length: 0);
                $calls[] = CallDTO::readProcessStderrLog(name: $name, offset: $offset, length: 0);
            }

            $response = $this->request(new MultiCallDTO(calls: $calls), $server);

            if (count($response->array()) !== count($dto->processes) * 2) {
                throw new LogicException('Response logs count mismatch');
            }

            /** @var array<int, string|FaultDTO> $processesLogs */
            $processesLogs = $response->array();
            foreach ($dto->processes as $key => $process) {
                $process->outLog = ProcessLog::fromStringOrFault($processesLogs[$key * 2]);
                $process->errLog = ProcessLog::fromStringOrFault($processesLogs[$key * 2 + 1]);
            }

            return $dto;
        } catch (BaseException $e) {
            return Supervisor::fail($server, $e->getMessage());
        }
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

            $newParamsItem = ['methodName' => $item->methodName];

            if ($builtParams !== []) {
                $newParamsItem['params'] = $builtParams;
            }

            $params[] = $newParamsItem;
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

        if ($response->hasFault()) {
            return new OperationResult(false, true, $response->getFirstFault()->message);
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

        if ($response->hasFault()) {
            return new OperationResult(ok: false, isFault: true, error: $response->getFirstFault()->message);
        }

        return new OperationResult(ok: true);
    }

    public function stopProcessGroup(string $name, SupervisorServer $server): OperationResult
    {
        $result = $this->request(CallDTO::stopProcessGroup($name), $server);

        return new OperationResult(
            ok: !$result->isFault,
            isFault: $result->isFault,
            error: $result->isFault ? $result->getFirstFault()->message : null
        );
    }

    public function startProcessGroup(string $name, SupervisorServer $server): OperationResult
    {
        $result = $this->request(CallDTO::startProcessGroup($name), $server);

        return new OperationResult(
            ok: !$result->isFault,
            isFault: $result->isFault,
            error: $result->isFault ? $result->getFirstFault()->message : null
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

        if ($response->hasFault()) {
            return new OperationResult(false, true, $response->getFirstFault()->message);
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

    public function cloneProcess(string $name, string $group, SupervisorServer $server): OperationResult
    {
        foreach ($this->getAllConfigInfo($server) as $config) {
            if ($config->group === $group) {
                $call = CallDTO::addProgramToGroup(group: $config->group, program: $name.'_'.time(), config: $config);

                return OperationResult::fromBooleanResponse(response: $this->request(call: $call, server: $server));
            }
        }

        throw new LogicException("Group $group not found");
    }

    public function removeProcess(string $name, string $group, SupervisorServer $server): OperationResult
    {
        $this->stopProcess(name: $name, server: $server);

        $call = CallDTO::removeProcessFromGroup(group: $group, program: $name);

        return OperationResult::fromBooleanResponse(response: $this->request(call: $call, server: $server));
    }

    /** @return Config[] */
    public function getAllConfigInfo(SupervisorServer $server): array
    {
        return Config::fromResponseArray(response: $this->request(call: CallDTO::getAllConfigInfo(), server: $server));
    }
}
