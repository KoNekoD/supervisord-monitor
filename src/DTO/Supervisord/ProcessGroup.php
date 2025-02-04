<?php

declare(strict_types=1);

namespace App\DTO\Supervisord;

final readonly class ProcessGroup
{
    /** @param Process[] $processes */
    public function __construct(public string $name, public array $processes) {}
}
