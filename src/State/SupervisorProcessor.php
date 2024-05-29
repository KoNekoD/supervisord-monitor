<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiClient\SupervisorApiClient;
use App\DTO\SupervisorManage;
use App\DTO\SupervisorManageResult;
use App\DTO\SupervisorServer;
use App\Enum\SupervisorManageTypeEnum;
use App\Enum\SupervisorManageTypeEnum as Enum;
use App\Exception\BaseException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/** @implements ProcessorInterface<SupervisorManage, mixed> */
final readonly class SupervisorProcessor implements ProcessorInterface
{
    /** @param array<string, SupervisorServer> $servers */
    public function __construct(
        private SupervisorApiClient $api,
        #[Autowire(param: 'supervisors_servers')] private array $servers
    ) {}

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): SupervisorManageResult
    {
        $serverString = (string)$data->server;
        /** @var SupervisorManageTypeEnum $type */
        $type = $data->type;
        $group = (string)$data->group;
        $process = (string)$data->process;
        $full = $group.':'.$process;

        $server = $this->servers[$serverString] ?? null;
        if (null === $server) {
            throw new BaseException(sprintf('Server "%s" not found', $serverString));
        }

        $typedResult = match ($type) {
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

        return new SupervisorManageResult(typedResult: $typedResult);
    }
}
