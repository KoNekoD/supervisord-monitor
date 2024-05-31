<?php

declare(strict_types=1);

namespace App\DTO;

class ProcessLog
{
    public function __construct(public string $log) {}

    public static function fromString(string $log): ?self
    {
        if ($log === '') {
            return null;
        }

        return new self($log);
    }

    public static function fromStringOrFault(string|FaultDTO $log): ?self
    {
        if ($log instanceof FaultDTO) {
            return self::fromFault($log);
        } else {
            return self::fromString($log);
        }
    }

    public static function fromFault(FaultDTO $fault): self
    {
        return new self('Failed to fetch logs. Error: '.$fault->message);
    }
}
