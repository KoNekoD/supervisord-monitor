<?php

declare(strict_types=1);

namespace App\DTO\Output;

use App\DTO\XmlRpc\ResponseDTO;

class ChangedProcessesDTO
{
    /** @param ChangedProcessDTO[] $changedProcesses */
    public function __construct(
        public bool $ok,
        public array $changedProcesses,
        public ?string $error = null
    ) {}

    public static function fromResponse(ResponseDTO $response): self
    {
        if ($response->isFault) {
            return new self(false, [], $response->getFault()->message);
        }

        $changedProcesses = [];
        foreach ($response->getValue() as $changedProcess) {
            /** @var array<string, mixed> $changedProcess */
            $changedProcesses[] = ChangedProcessDTO::fromArray($changedProcess);
        }

        return new self(true, $changedProcesses);
    }
}
