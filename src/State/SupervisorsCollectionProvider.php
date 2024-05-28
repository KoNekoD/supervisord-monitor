<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiClient\SupervisorApiClient;
use App\ApiResource\Supervisor;
use App\DTO\ProcessLog;
use App\Exception\XmlRpcException;
use App\Service\SupervisorServerProvider;

final readonly class SupervisorsCollectionProvider implements ProviderInterface
{
    public function __construct(
        private SupervisorServerProvider $supervisorServerProvider,
        public SupervisorApiClient $api
    ) {}

    /** @return Supervisor[] */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        /** @var Supervisor[] $result */
        $result = [];

        $servers = $this->supervisorServerProvider->provideList();

        foreach ($servers as $server) {

            $dto = $this->api->getAllProcessInfo($server);

            foreach ($dto->processes as $worker) {
                $outLog = null;
                try {
                    $outLog = $this->api->readProcessStdoutLog(
                        name: $worker->getFullProcessName(),
                        offset: -10000,
                        length: 0,
                        server: $server
                    );
                } catch (XmlRpcException $e) { // Caused when supervisor send incorrect formatting data
                    $outLog = new ProcessLog('Failed to fetch logs. Please clear logs. Error: '.$e->getMessage());
                }

                $errLog = null;
                try {
                    $errLog = $this->api->readProcessStderrLog(
                        name: $worker->getFullProcessName(),
                        offset: -10000,
                        length: 0,
                        server: $server
                    );
                } catch (XmlRpcException $e) { // Caused when supervisor send incorrect formatting data
                    $errLog = new ProcessLog('Failed to fetch logs. Please clear logs. Error: '.$e->getMessage());
                }

                $worker->errLog = $errLog;
                $worker->outLog = $outLog;
            }


            $result[] = $dto;
        }

        return $result;
    }
}
