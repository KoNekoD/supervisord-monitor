<?php

declare(strict_types=1);

namespace App\DTO\XmlRpc;

final readonly class OperationResult
{
    public function __construct(public bool $ok, public bool $isFault = false, public ?string $error = null) {}

    public static function fromBooleanResponse(ResponseDTO $response): self
    {
        if ($response->isFault) {
            return new self(false, true, $response->getFirstFault()->message);
        }

        if (false === $response->bool()) {
            return new self(false, false, 'Operation failed');
        }

        return new self(true);
    }
}
