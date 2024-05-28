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
}
