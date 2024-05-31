/* eslint-disable */
/* tslint:disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

interface ApiChangedProcess {
  name: string;
  group: string;
  status: number;
  description: string;
}

interface ApiChangedProcesses {
  ok: boolean;
  changedProcesses: ApiChangedProcess[];
  error: string | null;
}

interface ApiOperationResult {
  ok: boolean;
  isFault: boolean;
  error: string | null;
}

interface ApiProcess {
  errLog: ApiProcessLog | null;
  outLog: ApiProcessLog | null;
  descPid: string;
  descUptime: string;
  name: string;
  group: string;
  start: number;
  stop: number;
  now: number;
  state: number;
  stateName: string;
  spawnErr: string;
  exitStatus: number;
  logfile: string;
  stdoutLogfile: string;
  stderrLogfile: string;
  pid: number;
  description: string;
  fullProcessName: string;
}

interface ApiProcessLog {
  log: string;
}

interface ApiSupervisor {
  processes: ApiProcess[];
  version: string;
  ok: boolean;
  server: ApiSupervisorServer;
  failError: string | null;
}

interface ApiSupervisorSupervisorManage {
  type:
    | 'start_all_processes'
    | 'stop_all_processes'
    | 'restart_all_processes'
    | 'clear_all_process_log'
    | 'start_process_group'
    | 'stop_process_group'
    | 'restart_process_group'
    | 'start_process'
    | 'stop_process'
    | 'restart_process'
    | 'clear_process_log'
    | 'clone_process'
    | 'remove_process';
  server: string | null;
  group: string | null;
  process: string | null;
}

interface ApiSupervisorSupervisorManageResult {
  operationResult: ApiOperationResult | null;
  changedProcesses: ApiChangedProcesses | null;
}

interface ApiSupervisorServer {
  webOpenUrl: string;
  authenticated: boolean;
  ip: string;
  port: number;
  name: string;
  username: string | null;
  password: string | null;
}
