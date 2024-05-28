<?php

declare(strict_types=1);

namespace App\DTO;

use App\Enum\SupervisorManageTypeEnum;

final readonly class SupervisorManage
{

    public function __construct(
        public ?SupervisorManageTypeEnum $type,
    ) {}

    public function getType(): SupervisorManageTypeEnum
    {
        /** @var SupervisorManageTypeEnum $type */
        $type = $this->type;

        return $type;
    }
}
