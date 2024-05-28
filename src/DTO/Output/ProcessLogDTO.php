<?php

declare(strict_types=1);

namespace App\DTO\Output;

use App\DTO\XmlRpc\ResponseDTO;
use Riverwaysoft\PhpConverter\Filter\Attributes\Dto;

#[Dto]
class ProcessLogDTO
{
    public function __construct(public string $log) {}

    public static function fromResponse(ResponseDTO $response): ?self
    {
        if ($response->isFault) {
            $log = 'Failed to fetch logs. Error: '.$response->getFault()->message;
        } else {
            $log = $response->string();
        }


        if ($log === '') {
            return null;
        }

        return new self($log);
    }
}
