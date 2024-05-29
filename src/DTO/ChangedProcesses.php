<?php

declare(strict_types=1);

namespace App\DTO;

class ChangedProcesses
{
    /** @param ChangedProcess[] $changedProcesses */
    public function __construct(
        public bool $ok,
        public array $changedProcesses,
        public ?string $error = null
    ) {}

    public static function fromResponse(ResponseDTO $response): self
    {
        if ($response->isFault) {
            return new self(false, [], $response->getFirstFault()->message);
        }

        $changedProcesses = [];
        foreach ($response->getValue() as $changedProcess) {
            /** @var array<string, mixed> $changedProcess */
            $changedProcesses[] = ChangedProcess::fromArray($changedProcess);
        }

        return new self(true, $changedProcesses);
    }
}
