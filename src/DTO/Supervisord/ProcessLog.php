<?php

declare(strict_types=1);

namespace App\DTO\Supervisord;

use App\DTO\XmlRpc\FaultDTO;

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

    /** @param string|array<int|string, mixed> $log */
    public static function fromStringOrFault(string|array $log): ?self
    {
        if (is_array($log)) {
            return self::fromFault(FaultDTO::fromArray($log));
        } else {
            return self::fromString($log);
        }
    }

    public static function fromFault(FaultDTO $fault): self
    {
        return new self('Failed to fetch logs. Error: '.$fault->message);
    }
}
