<?php

declare(strict_types=1);

namespace App\Exception;

use App\DTO\ResponseDTO;

final class XmlRpcException extends BaseException
{
    public static function invalidResponseValue(ResponseDTO $DTO): self
    {
        return new self('Invalid response value: '.json_encode($DTO->value));
    }
}
