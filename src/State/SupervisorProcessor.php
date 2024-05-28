<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiClient\SupervisorApiClient;
use App\DTO\SupervisorManage;
use App\Enum\SupervisorManageTypeEnum as Enum;
use App\Service\SupervisorServerProvider;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/** @implements ProcessorInterface<SupervisorManage, mixed> */
final readonly class SupervisorProcessor implements ProcessorInterface
{
    public function __construct(
        private SupervisorServerProvider $supervisorServerProvider,
        private SupervisorApiClient $api
    ) {}

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ) {
        /** @var array{server: string, group?: string, process?: string, type: string} $uriVariables */

        $serverString = $uriVariables['server'];
        $typeString = $uriVariables['type'];
        $type = Enum::tryFrom($typeString);
        if (!$type instanceof Enum) {
            throw new BadRequestHttpException('Unknown type: '.$typeString);
        }
        $group = $uriVariables['group'] ?? '';
        $process = $uriVariables['process'] ?? '';
        $full = $group.':'.$process;

        $server = $this->supervisorServerProvider->provide(server: $serverString);

        return match ($type) {
            Enum::StartAllProcesses => $this->api->startAllProcesses(server: $server),
            Enum::StopAllProcesses => $this->api->stopAllProcesses(server: $server),
            Enum::RestartAllProcesses => $this->api->restartAllProcesses(server: $server),
            Enum::ClearAllProcessLogs => $this->api->clearAllProcessLogs(server: $server),
            Enum::StartProcessGroup => $this->api->startProcessGroup(name: $group, server: $server),
            Enum::StopProcessGroup => $this->api->stopProcessGroup(name: $group, server: $server),
            Enum::RestartProcessGroup => $this->api->restartProcessGroup(name: $group, server: $server),
            Enum::StartProcess => $this->api->startProcess(name: $full, server: $server),
            Enum::StopProcess => $this->api->stopProcess(name: $full, server: $server),
            Enum::RestartProcess => $this->api->restartProcess(name: $full, server: $server),
            Enum::ClearProcessLogs => $this->api->clearProcessLogs(name: $full, server: $server),
            Enum::CloneProcess => $this->api->cloneProcess(name: $process, group: $group, server: $server),
            Enum::RemoveProcess => $this->api->removeProcess(name: $process, group: $group, server: $server),
        };
    }
}
