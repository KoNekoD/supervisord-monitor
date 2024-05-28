<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\DTO\Process;
use App\DTO\SupervisorManage;
use App\DTO\SupervisorServer;
use App\State\SupervisorProcessor;
use App\State\SupervisorsCollectionProvider;

#[ApiResource(
    operations: [
        new GetCollection(
            provider: SupervisorsCollectionProvider::class
        ),
        new Post(
            uriTemplate: '/supervisors/manage/{server}/{type}',
            input: SupervisorManage::class,
            processor: SupervisorProcessor::class
        ),
        new Post(
            uriTemplate: '/supervisors/manage/{server}/{group}/{type}',
            input: SupervisorManage::class,
            processor: SupervisorProcessor::class
        ),
        new Post(
            uriTemplate: '/supervisors/manage/{server}/{group}/{process}/{type}',
            input: SupervisorManage::class,
            processor: SupervisorProcessor::class
        ),
    ]
)]
class Supervisor
{
    /**
     * @param Process[] $processes
     */
    public function __construct(
        /** @var Process[] $processes */
        public array $processes,
        public string $version,
        public bool $ok,
        public SupervisorServer $server,
        public ?string $failError,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(
        array $data,
        string $version,
        SupervisorServer $server,
    ): self {
        $processes = [];
        foreach ($data as $item) {
            /** @var array<string, int|string> $item */
            $processes[] = Process::fromArray($item);
        }

        return new self(
            processes: $processes,
            version: $version,
            ok: true,
            server: $server,
            failError: null
        );
    }

    public static function fail(SupervisorServer $server, string $error): self
    {
        return new self(
            processes: [],
            version: '',
            ok: false,
            server: $server,
            failError: $error
        );
    }
}
