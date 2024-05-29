<?php

declare(strict_types=1);

namespace App\DTO;

use App\Enum\SupervisorManageTypeEnum;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

#[Assert\Callback('validate')]
final readonly class SupervisorManage
{
    public function __construct(
        public ?SupervisorManageTypeEnum $type,
        public ?string $server,
        public ?string $group,
        public ?string $process,
    ) {}

    public function validate(ExecutionContextInterface $context): void
    {
        if (!$this->type instanceof SupervisorManageTypeEnum) {
            $context->buildViolation('Type is required')->atPath('type')->addViolation();

            return;
        }

        if (null === $this->server) {
            $context->buildViolation('Server is required')->atPath('server')->addViolation();
        }

        if ($this->type->isGroupRelated() && null === $this->group) {
            $context->buildViolation('Group is required')->atPath('group')->addViolation();
        }

        if ($this->type->isProcessRelated() && null === $this->process) {
            $context->buildViolation('Process is required')->atPath('process')->addViolation();
        }
    }
}
