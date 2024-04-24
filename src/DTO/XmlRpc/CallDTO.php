<?php

declare(strict_types=1);

namespace App\DTO\XmlRpc;

use App\DTO\Output\ConfigDTO;

readonly class CallDTO implements CallInterface
{
    /**
     * @param (array<int, int|float|string|bool|array<int, mixed>|array<string, mixed>|null>)|(array<string, mixed>)|null $params
     */
    public function __construct(public string $methodName, public ?array $params = []) {}

    public static function stopProcess(string $name): self
    {
        return self::new(
            'supervisor.stopProcess',
            ['name' => $name, 'wait' => true]
        );
    }

    /** @param array<string, mixed>|array{} $params */
    public static function new(string $method, array $params = []): self
    {
        return new self($method, $params);
    }

    //region Shortcuts
    public static function startProcess(string $name): self
    {
        return self::new(
            'supervisor.startProcess',
            ['name' => $name, 'wait' => true]
        );
    }

    public static function getSupervisorVersion(): self
    {
        return self::new('supervisor.getSupervisorVersion');
    }

    public static function getAllProcessInfo(): self
    {
        return self::new('supervisor.getAllProcessInfo');
    }

    public static function stopAllProcesses(): self
    {
        return self::new(
            'supervisor.stopAllProcesses',
            ['wait' => true]
        );
    }

    public static function startAllProcesses(): self
    {
        return self::new(
            'supervisor.startAllProcesses',
            ['wait' => true]
        );
    }

    public static function readProcessStderrLog(
        string $name,
        int $offset,
        int $length
    ): self {
        return self::new(
            'supervisor.readProcessStderrLog',
            ['name' => $name, 'offset' => $offset, 'length' => $length]
        );
    }

    public static function clearProcessLogs(string $name): self
    {
        return self::new(
            'supervisor.clearProcessLogs',
            ['name' => $name]
        );
    }

    public static function clearAllProcessLogs(): self
    {
        return self::new(
            'supervisor.clearAllProcessLogs'
        );
    }

    public static function listMethods(): self
    {
        return self::new('system.listMethods');
    }

    public static function methodSignature(string $method): self
    {
        return self::new(
            'system.methodSignature',
            ['method' => $method]
        );
    }

    public static function methodHelp(string $method): self
    {
        return self::new(
            'system.methodHelp',
            ['method' => $method]
        );
    }

    public static function getAllConfigInfo(): self
    {
        return self::new('supervisor.getAllConfigInfo');
    }

    /** Working with already defined groups in config(unload, load*) */
    public static function addProgramToGroup(string $group, string $program, ConfigDTO $config): self
    {
        return self::new(
            'twiddler.addProgramToGroup',
            [
                'group_name' => $group,
                'program_name' => $program,
                'program_options' => $config->jsonSerialize(),
            ]
        );
    }

    public static function removeProcessFromGroup(string $group, string $program): self
    {
        return self::new(
            'twiddler.removeProcessFromGroup',
            [
                'group_name' => $group,
                'program_name' => $program,
            ]
        );
    }

    public static function stopProcessGroup(string $name): self
    {
        return self::new(
            'supervisor.stopProcessGroup',
            [
                'name' => $name,
                'wait' => true,
            ]
        );
    }

    public static function startProcessGroup(string $name): self
    {
        return self::new(
            'supervisor.startProcessGroup',
            [
                'name' => $name,
                'wait' => true,
            ]
        );
    }


    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return ['methodName' => $this->methodName, 'params' => $this->params];
    }

    /** @return (array<int, int|float|string|bool|array<int, mixed>|array<string, mixed>|null>)|(array<string, mixed>) */
    public function getParams(): array
    {
        if (null === $this->params) {
            return [];
        }

        return [$this->params];
    }
    //endregion Shortcuts
}
