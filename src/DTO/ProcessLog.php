<?php

declare(strict_types=1);

namespace App\DTO;

class ProcessLog
{
    public function __construct(public string $log) {}

    public static function fromResponse(ResponseDTO $response): ?self
    {
        $log = $response->isFault ? 'Failed to fetch logs. Error: '.$response->getFault()->message : $response->string(
        );


        if ($log === '') {
            return null;
        }

        return new self($log);
    }
}
