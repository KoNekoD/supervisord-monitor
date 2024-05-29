<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\DTO\Process;
use App\DTO\SupervisorManage;
use App\DTO\SupervisorManageResult;
use App\DTO\SupervisorServer;
use App\State\SupervisorProcessor;
use App\State\SupervisorsCollectionProvider;

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
    /** @param array<int, Process> $processes */
    public function __construct(
        public array $processes,
        public string $version,
        public bool $ok,
        public SupervisorServer $server,
        public ?string $failError,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data, string $version, SupervisorServer $server): self
    {
        $processes = [];
        /** @var array<string, array<string, int|string>> $data */
        foreach ($data as $item) {
            $processes[] = Process::fromArray($item);
        }

        return new self(processes: $processes, version: $version, ok: true, server: $server, failError: null);
    }

    public static function fail(SupervisorServer $server, string $error): self
    {
        return new self(processes: [], version: '', ok: false, server: $server, failError: $error);
    }
}
