<?php

declare(strict_types=1);

namespace App\Enum;

enum SupervisorManageTypeEnum: string
{
    case StartAllProcesses = 'start_all_processes';
    case StopAllProcesses = 'stop_all_processes';
    case RestartAllProcesses = 'restart_all_processes';
    case ClearAllProcessLogs = 'clear_all_process_log';
    case StartProcessGroup = 'start_process_group';
    case StopProcessGroup = 'stop_process_group';
    case RestartProcessGroup = 'restart_process_group';
    case StartProcess = 'start_process';
    case StopProcess = 'stop_process';
    case RestartProcess = 'restart_process';
    case ClearProcessLogs = 'clear_process_log';
    case CloneProcess = 'clone_process';
    case RemoveProcess = 'remove_process';

    public function isGroupRelated(): bool
    {
        return match ($this) {
            self::StartProcessGroup, self::StopProcessGroup, self::RestartProcessGroup => true,
            default => false
        };
    }

    public function isProcessRelated(): bool
    {
        return match ($this) {
            self::StartProcess, self::StopProcess, self::RestartProcess, self::ClearProcessLogs, self::CloneProcess, self::RemoveProcess => true,
            default => false
        };
    }
}
