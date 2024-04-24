<?php

declare(strict_types=1);

namespace App\DTO\XmlRpc;

use App\Exception\XmlRpcException;

class ResponseDTO
{
    /** @param int|float|string|bool|array<int, mixed>|array<string, mixed>|null $value */
    public function __construct(public int|float|string|bool|array|null $value, public bool $isFault = false) {}

    public function isFault(): bool
    {
        return $this->isFault;
    }

    public function getFault(): FaultDTO
    {
        if (!is_array($this->value)) {
            throw new XmlRpcException('Invalid value for fault');
        }

        if (!$this->isFault && !FaultDTO::is($this->value)) {
            throw new XmlRpcException('Response is not a fault');
        }

        return FaultDTO::fromArray($this->value);
    }

    /** @return array<string, mixed> */
    public function getValue(): array
    {
        if (!is_array($this->value)) {
            throw new XmlRpcException('Invalid value');
        }

        /** @var array<string, mixed> $value */
        $value = $this->value;

        return $value;
    }

    public function string(): string
    {
        if (!is_string($this->value)) {
            throw new XmlRpcException('Invalid value');
        }

        return $this->value;
    }

    /** @return string[] */
    public function arrayOfStrings(): array
    {
        if (!is_array($this->value)) {
            throw new XmlRpcException('Invalid value');
        }

        /** @var string[] $value */
        $value = $this->value;

        return $value;
    }

    public function bool(): bool
    {
        if (!is_bool($this->value)) {
            throw new XmlRpcException('Invalid value');
        }

        return $this->value;
    }

    /** @return bool[] */
    public function boolArray(): array
    {
        if (!is_array($this->value)) {
            throw new XmlRpcException('Invalid value');
        }

        foreach ($this->value as $item) {
            if (!is_bool($item)) {
                throw new XmlRpcException('Invalid value: '. json_encode($item));
            }
        }

        /** @var bool[] $value */
        $value = $this->value;

        return $value;
    }

    /** @return array<string|int, mixed> */
    public function array(): array
    {
        if (!is_array($this->value)) {
            throw new XmlRpcException('Invalid value');
        }

        /** @var array<string|int, mixed> $value */
        $value = $this->value;

        return $value;
    }

}
