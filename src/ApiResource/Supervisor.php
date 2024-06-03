<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\DTO\Process;
use App\DTO\ProcessGroup;
use App\DTO\SupervisorManage;
use App\DTO\SupervisorManageResult;
use App\DTO\SupervisorServer;
use App\State\SupervisorProcessor;
use App\State\SupervisorsCollectionProvider;
use Symfony\Component\Serializer\Attribute\Ignore;

#[ApiResource(
    operations: [
        new GetCollection(
            provider: SupervisorsCollectionProvider::class
        ),
        new Post(
            uriTemplate: '/supervisors/manage',
            input: SupervisorManage::class,
            output: SupervisorManageResult::class,
            processor: SupervisorProcessor::class,
        ),
    ]
)]
class Supervisor
{
    /** @param array<int, ProcessGroup> $groups */
    public function __construct(
        public array $groups,
        public string $version,
        public bool $ok,
        public SupervisorServer $server,
        public ?string $failError,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data, string $version, SupervisorServer $server): self
    {
        /** @var array<int, ProcessGroup> $groups */
        $groups = [];
        /** @var array<string, Process[]> $processes */
        $processes = [];

        /** @var array<string, array<string, int|string>> $data */
        foreach ($data as $item) {
            $process = Process::fromArray($item);
            $processes[$process->group][] = $process;
        }

        foreach ($processes as $groupName => $group) {
            $groups[] = new ProcessGroup(name: $groupName, processes: $group);
        }

        return new self(groups: $groups, version: $version, ok: true, server: $server, failError: null);
    }

    public static function fail(SupervisorServer $server, string $error): self
    {
        return new self(groups: [], version: '', ok: false, server: $server, failError: $error);
    }

    /** @return Process[] */
    #[Ignore]
    public function getProcesses(): array
    {
        /** @var Process[] $result */
        $result = [];

        foreach ($this->groups as $group) {
            foreach ($group->processes as $process) {
                $result[] = $process;
            }
        }

        return $result;
    }
}
