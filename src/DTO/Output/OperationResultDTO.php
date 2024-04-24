<?php

declare(strict_types=1);

namespace App\DTO\Output;

use App\DTO\XmlRpc\ResponseDTO;

final readonly class OperationResultDTO
{
    public function __construct(public bool $ok, public bool $isFault = false, public ?string $error = null) {}

    public static function fromBooleanResponse(ResponseDTO $response): self
    {
        if ($response->isFault) {
            return new self(false, true, $response->getFault()->message);
        }

        if (false === $response->bool()) {
            return new self(false, false, 'Operation failed');
        }

        return new self(true);
    }
}
