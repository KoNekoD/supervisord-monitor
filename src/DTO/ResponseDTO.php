<?php

declare(strict_types=1);

namespace App\DTO;

use App\Exception\XmlRpcException;

class ResponseDTO
{
    public bool $isFault = false;

    /** @var FaultDTO[] $faultInValue */
    public array $faultInValue = [];

    /** @param int|float|string|bool|array<int, mixed>|array<string, mixed>|null $value */
    public function __construct(public int|float|string|bool|array|null $value, bool $isFault = false)
    {
        if ($isFault === false && is_array($value)) {
            foreach ($value as $item) {
                if (is_array($item) && FaultDTO::is($item)) {
                    $this->faultInValue[] = FaultDTO::fromArray($item);
                }
            }
        }

        $this->isFault = $isFault;
    }

    public function hasFault(): bool
    {
        return $this->isFault || !empty($this->faultInValue);
    }

    public function getFirstFault(): FaultDTO
    {
        if (!is_array($this->value)) {
            throw new XmlRpcException('Invalid value for fault');
        }

        if (!empty($this->faultInValue)) {
            return $this->faultInValue[0];
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
