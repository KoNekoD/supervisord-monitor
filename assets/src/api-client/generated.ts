export type AllProcessInfoDTO = {
  processes: ProcessInfoDTO[];
  version: string;
  ok: boolean;
  server: SupervisorServerDTO;
  failError: string | null;
};

export type FaultDTO = {
  code: number;
  message: string;
};

export type ProcessInfoDTO = {
  errLog: ProcessLogDTO | null;
  outLog: ProcessLogDTO | null;
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
};

export type ProcessLogDTO = {
  log: string;
};

export type SupervisorServerDTO = {
  webOpenUrl: string;
  authenticated: boolean;
  ip: string;
  port: number;
  name: string;
  username: string | null;
  password: string | null;
};

export type WorkerDTO = {
  server: string;
  name: string;
  group: string;
};
