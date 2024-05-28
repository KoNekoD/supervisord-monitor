<?php

declare(strict_types=1);

namespace App\DTO\Input;

use Riverwaysoft\PhpConverter\Filter\Attributes\Dto;

#[Dto]
readonly class WorkerDTO
{
    public function __construct(
        public string $server,
        public string $name,
        public string $group,
    ) {}

    public function getFullName(): string
    {
        return $this->group.':'.$this->name;
    }
}
