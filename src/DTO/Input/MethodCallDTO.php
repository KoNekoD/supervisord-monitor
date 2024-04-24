<?php

declare(strict_types=1);

namespace App\DTO\Input;

class MethodCallDTO
{
    public function __construct(public MethodCallInnerDTO $methodCall) {}

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
        return new self(
            methodCall: new MethodCallInnerDTO(
                methodName: $method,
                params: $params
            )
        );
    }

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

    public static function addProgramToGroup(): self
    {
        return self::new(
            'twiddler.addProgramToGroup',
            [
                'group_name' => 'default',// todo
                'program_name' => 'supervisor',
                'program_options' => [],
            ]
        );
    }
}
