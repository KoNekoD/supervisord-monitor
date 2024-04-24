<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\Input\WorkerDTO;
use App\DTO\Output\AllProcessInfoDTO;
use App\DTO\Output\ChangedProcessesDTO;
use App\DTO\Output\OperationResultDTO;
use App\DTO\Output\SupervisorServerDTO;
use App\Exception\BaseException;
use LogicException;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class SupervisorsApiManager
{
    /** @var SupervisorApiClient[] $clients */
    private array $clients;

    public function __construct(
        private ParameterBagInterface $parameterBag,
        private SerializerService $serializerService,
        LoggerInterface $logger,
        HttpClientInterface $httpClient
    ) {
        /** @var SupervisorApiClient[] $clients */
        $clients = [];
        foreach ($this->provideAllServers() as $server) {
            $clients[] = new SupervisorApiClient(
                server: $server,
                logger: $logger,
                client: $httpClient->withOptions([]),
            );
        }
        $this->clients = $clients;
    }

    /** @return SupervisorServerDTO[] */
    public function provideAllServers(): array
    {
        $servers = $this->parameterBag->get('supervisors_servers');
        /** @var class-string $type */
        $type = SupervisorServerDTO::class.'[]';
        try {
            /** @var SupervisorServerDTO[] $result */
            $result = $this->serializerService->denormalize(
                $servers,
                $type
            );

            return $result;
        } catch (ExceptionInterface $e) {
            throw new BaseException($e->getMessage(), $e->getCode(), $e);
        }
    }

    /** @return SupervisorApiClient[] */
    public function provideAll(): array
    {
        return $this->clients;
    }

    /** @return AllProcessInfoDTO[] */
    public function provideAllProcessInfo(): array
    {
        /** @var AllProcessInfoDTO[] $result */
        $result = [];

        foreach ($this->clients as $client) {

            $dto = $client->getAllProcessInfo();

            foreach ($dto->processes as $worker) {
                $log = $client->readProcessStderrLog(name: $worker->getFullProcessName(), offset: -10000, length: 0);

                $worker->log = $log;
            }


            $result[] = $dto;
        }

        return $result;
    }

    public function restartProcess(WorkerDTO $DTO): OperationResultDTO
    {
        $api = $this->provideClient($DTO->server);

        return $api->restartProcess($DTO->getFullName());
    }

    public function provideClient(string $name): SupervisorApiClient
    {
        foreach ($this->clients as $client) {
            if ($client->server->name === $name) {
                return $client;
            }
        }

        throw new NotFoundHttpException(
            "Client with name $name not found"
        );
    }

    public function stopProcess(WorkerDTO $DTO): OperationResultDTO
    {
        return $this->provideClient($DTO->server)->stopProcess($DTO->getFullName());
    }

    public function startProcess(WorkerDTO $DTO): OperationResultDTO
    {
        return $this->provideClient($DTO->server)->startProcess($DTO->getFullName());
    }

    public function restartAllProcesses(string $server): OperationResultDTO
    {
        $api = $this->provideClient($server);

        return $api->restartAllProcesses();
    }

    public function stopAllProcesses(string $server): ChangedProcessesDTO
    {
        return $this->provideClient($server)->stopAllProcesses();
    }

    public function startAllProcesses(string $server): ChangedProcessesDTO
    {
        return $this->provideClient($server)->startAllProcesses();
    }

    public function clearProcessLogs(WorkerDTO $DTO): OperationResultDTO
    {
        return $this->provideClient($DTO->server)->clearProcessLogs($DTO->getFullName());
    }

    public function cloneProcess(WorkerDTO $DTO): OperationResultDTO
    {
        $api = $this->provideClient($DTO->server);

        foreach ($api->getAllConfigInfo() as $config) {
            if ($config->group === $DTO->group) {
                $name = $DTO->name.'_'.time();

                return $api->addProgramToGroup($config->group, $name, $config);
            }
        }

        throw new LogicException("Group $DTO->group not found");
    }

    public function removeProcess(WorkerDTO $DTO): OperationResultDTO
    {
        $api = $this->provideClient($DTO->server);

        $this->stopProcess($DTO);

        return $api->removeProcessFromGroup($DTO->group, $DTO->name);
    }

    public function clearAllProcessLogs(string $server): ChangedProcessesDTO
    {
        return $this->provideClient($server)->clearAllProcessLogs();
    }
}
