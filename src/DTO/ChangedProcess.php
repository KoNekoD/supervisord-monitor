<?php

declare(strict_types=1);

namespace App\DTO;

class ChangedProcess
{
    public function __construct(
        public string $name,
        public string $group,
        public int $status,
        public string $description
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): self
    {
        /** @var array{name: string, group: string, status: int, description: string} $data */
        return new self(
            name: $data['name'],
            group: $data['group'],
            status: $data['status'],
            description: $data['description']
        );
    }
}
