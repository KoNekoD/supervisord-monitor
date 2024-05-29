<?php

declare(strict_types=1);

namespace App\DTO;

class SupervisorManageResult
{
    public ?OperationResult $operationResult = null;
    public ?ChangedProcesses $changedProcesses = null;

    public function __construct(OperationResult|ChangedProcesses $typedResult)
    {
        if ($typedResult instanceof OperationResult) {
            $this->operationResult = $typedResult;
        }

        if ($typedResult instanceof ChangedProcesses) {
            $this->changedProcesses = $typedResult;
        }
    }
}
