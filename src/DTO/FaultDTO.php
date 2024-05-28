<?php

declare(strict_types=1);

namespace App\DTO;

class FaultDTO
{
    public function __construct(public int $code, public string $message) {}

    /** @param array<string|int, mixed> $data */
    public static function fromArray(array $data): self
    {
        /** @var array{faultCode: int, faultString: string} $data */
        return new self(code: $data['faultCode'], message: $data['faultString']);
    }

    /** @param array<int|string, mixed> $data */
    public static function is(array $data): bool
    {
        return isset($data['faultCode'], $data['faultString']);
    }
}
