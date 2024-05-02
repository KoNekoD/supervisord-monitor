<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\Output\AllProcessInfoDTO;
use App\DTO\Output\ChangedProcessesDTO;
use App\DTO\Output\ConfigDTO;
use App\DTO\Output\OperationResultDTO;
use App\DTO\Output\ProcessLogDTO;
use App\DTO\Output\SupervisorServerDTO;
use App\DTO\XmlRpc\CallDTO;
use App\DTO\XmlRpc\CallInterface;
use App\DTO\XmlRpc\MultiCallDTO;
use App\DTO\XmlRpc\ResponseDTO;
use App\Exception\BaseException;
use LogicException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\Response\CurlResponse;
use Symfony\Contracts\HttpClient\Exception\ExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class SupervisorApiClient
{
    public function __construct(
        public readonly SupervisorServerDTO $server,
        private readonly LoggerInterface $logger,
        private HttpClientInterface $client,
        private readonly XmlRpcEncoder $encoder = new XmlRpcEncoder()
    ) {
        if (null !== $server->username && null !== $server->password) {
            $this->client = $this->client->withOptions(
                [
                    'auth_basic' => [$server->username, $server->password],
                    'timeout' => 60,
                ],
            );
        }
    }

    public function getAllProcessInfo(): AllProcessInfoDTO
    {
        try {
            return AllProcessInfoDTO::fromArray(
                data: $this->request(CallDTO::getAllProcessInfo())->getValue(),
                version: $this->getSupervisorVersion(),
                ok: true,
                server: $this->server,
            );
        } catch (BaseException $e) {
            return AllProcessInfoDTO::fail($this->server, $e->getMessage());
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

    private function request(CallInterface $call): ResponseDTO
    {
        if ($call instanceof MultiCallDTO) {
            $call = $this->convertMultiCallToCall($call);
        }
        if (!$call instanceof CallDTO) {
            throw new LogicException('Call should be instance of CallDTO');
        }

        $body = $this->encoder->encodeCallForSupervisor($call);

        try {
            $response = $this->client->request('POST', $this->server->getUrl(), ['body' => $body]);

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

    public function getSupervisorVersion(): string
    {
        return $this->request(CallDTO::getSupervisorVersion())->string();
    }

    public function restartProcess(string $name): OperationResultDTO
    {
        $response = $this->request(
            new MultiCallDTO([
                    CallDTO::stopProcess($name),
                    CallDTO::startProcess($name),
                ]
            )
        );

        if ($response->isFault()) {
            return new OperationResultDTO(false, true, $response->getFault()->message);
        }

        $ok = true;
        foreach ($response->boolArray() as $bool) {
            if (!$bool) {
                $ok = false;
                break;
            }
        }

        return new OperationResultDTO($ok);
    }

    public function stopProcess(string $name): OperationResultDTO
    {
        return OperationResultDTO::fromBooleanResponse($this->request(CallDTO::stopProcess($name)));
    }

    public function startProcessGroup(string $name): OperationResultDTO
    {
        $result = $this->request(CallDTO::startProcessGroup($name));

        return new OperationResultDTO(
            ok: !$result->isFault,
            isFault: $result->isFault,
            error: $result->isFault ? $result->getFault()->message : null
        );
    }

    public function stopProcessGroup(string $name): OperationResultDTO
    {
        $result = $this->request(CallDTO::stopProcessGroup($name));

        return new OperationResultDTO(
            ok: !$result->isFault,
            isFault: $result->isFault,
            error: $result->isFault ? $result->getFault()->message : null
        );
    }

    public function restartProcessGroup(string $name): OperationResultDTO
    {
        $response = $this->request(
            new MultiCallDTO([
                    CallDTO::stopProcessGroup($name),
                    CallDTO::startProcessGroup($name),
                ]
            )
        );

        if ($response->isFault()) {
            return new OperationResultDTO(false, true, $response->getFault()->message);
        }

        return new OperationResultDTO(true);
    }

    public function startProcess(string $name): OperationResultDTO
    {
        return OperationResultDTO::fromBooleanResponse($this->request(CallDTO::startProcess($name)));
    }

    public function stopAllProcesses(): ChangedProcessesDTO
    {
        return ChangedProcessesDTO::fromResponse($this->request(CallDTO::stopAllProcesses()));
    }

    public function startAllProcesses(): ChangedProcessesDTO
    {
        return ChangedProcessesDTO::fromResponse($this->request(CallDTO::startAllProcesses()));
    }

    public function restartAllProcesses(): OperationResultDTO
    {
        $response = $this->request(
            new MultiCallDTO([
                    CallDTO::stopAllProcesses(),
                    CallDTO::startAllProcesses(),
                ]
            )
        );

        if ($response->isFault()) {
            return new OperationResultDTO(false, true, $response->getFault()->message);
        }

        return new OperationResultDTO(true);
    }

    public function readProcessStderrLog(string $name, int $offset, int $length): ?ProcessLogDTO
    {
        return ProcessLogDTO::fromResponse(
            $this->request(CallDTO::readProcessStderrLog(name: $name, offset: $offset, length: $length))
        );
    }

    public function clearProcessLogs(string $name): OperationResultDTO
    {
        return OperationResultDTO::fromBooleanResponse($this->request(CallDTO::clearProcessLogs($name)));
    }

    public function clearAllProcessLogs(): ChangedProcessesDTO
    {
        $this->client = $this->client->withOptions(['timeout' => 60 * 5]);

        return ChangedProcessesDTO::fromResponse($this->request(CallDTO::clearAllProcessLogs()));
    }

    /** @return string[] */
    public function listMethods(): array
    {
        return $this->request(CallDTO::listMethods())->arrayOfStrings();
    }

    /** @return string[] */
    public function methodSignature(string $method): array
    {
        return $this->request(CallDTO::methodSignature($method))->arrayOfStrings();
    }

    public function methodHelp(string $method): string
    {
        return $this->request(CallDTO::methodHelp($method))->string();
    }

    /** @return ConfigDTO[] */
    public function getAllConfigInfo(): array
    {
        return ConfigDTO::fromResponseArray($this->request(CallDTO::getAllConfigInfo()));
    }

    public function addProgramToGroup(string $group, string $program, ConfigDTO $config): OperationResultDTO
    {
        return OperationResultDTO::fromBooleanResponse(
            $this->request(CallDTO::addProgramToGroup($group, $program, $config))
        );
    }

    public function removeProcessFromGroup(string $group, string $program): OperationResultDTO
    {
        return OperationResultDTO::fromBooleanResponse(
            $this->request(CallDTO::removeProcessFromGroup($group, $program))
        );
    }

    public function readProcessStdoutLog(string $name, int $offset, int $length): ?ProcessLogDTO
    {
        return ProcessLogDTO::fromResponse(
            $this->request(CallDTO::readProcessStdoutLog(name: $name, offset: $offset, length: $length))
        );
    }
}
