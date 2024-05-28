<?php

declare(strict_types=1);

namespace App\DTO\Output;

use Riverwaysoft\PhpConverter\Filter\Attributes\Dto;

#[Dto]
class AllProcessInfoDTO
{
    /**
     * @param ProcessInfoDTO[] $processes
     */
    public function __construct(
        /** @var ProcessInfoDTO[] $processes */
        public array $processes,
        public string $version,
        public bool $ok,
        public SupervisorServerDTO $server,
        public ?string $failError,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(
        array $data,
        string $version,
        bool $ok,
        SupervisorServerDTO $server,
    ): self {
        $processes = [];
        foreach ($data as $item) {
            /** @var array<string, int|string> $item */
            $processes[] = ProcessInfoDTO::fromArray($item);
        }

        return new self(
            processes: $processes,
            version: $version,
            ok: $ok,
            server: $server,
            failError: null
        );
    }

    public static function fail(SupervisorServerDTO $server, string $error): self
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
