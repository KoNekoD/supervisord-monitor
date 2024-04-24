<?php

declare(strict_types=1);

namespace App\DTO\Input;

class MethodCallInnerDTO
{
    /**
     * @param array<string, mixed>|array{} $params
     */
    public function __construct(
        public string $methodName,
        public array $params = [],
    ) {}
}
