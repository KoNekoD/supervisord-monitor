<?php

declare(strict_types=1);

namespace App\DTO\XmlRpc;

readonly class MultiCallDTO implements CallInterface
{
    /** @param CallDTO[] $calls */
    public function __construct(public array $calls) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return array_map(static fn(CallDTO $call): array => $call->toArray(), $this->calls);
    }
}
