import { IPromiseBasedObservable } from 'mobx-utils';
import { action, makeObservable, observable } from 'mobx';
import { Notificator } from './notificator';
import { TokenStorage } from './token-storage';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { useManageSupervisors } from '~/api/use-manage-supervisors';

export class LandingStore {
  prevData?: IPromiseBasedObservable<ApiSupervisor[]>;
  actualData?: IPromiseBasedObservable<ApiSupervisor[]>;

  autoRefreshIsActive: boolean;
  isAllowMutatorsActive: boolean;
  serverTimeDiff: number;

  constructor(
    private notificator: Notificator,
    private tokenStorage: TokenStorage,
    private manageSupervisors: ReturnType<typeof useManageSupervisors>,
    private invalidateSupervisors: ReturnType<typeof useInvalidateSupervisors>
  ) {
    makeObservable(this, {
      actualData: observable,
      prevData: observable,
      autoRefreshIsActive: observable,
      isAllowMutatorsActive: observable,
      serverTimeDiff: observable,
      updateAutoRefresh: action,
      switchAllowMutators: action,
      setServerTimeDiff: action,
    });

    this.autoRefreshIsActive = this.tokenStorage.isAutoRefresh();
    this.isAllowMutatorsActive = this.tokenStorage.isAllowMutatorsEnabled();
    this.serverTimeDiff = 0;

    this.manageSupervisors = useManageSupervisors();
    this.invalidateSupervisors = useInvalidateSupervisors();

    this.scheduleFetchDataRecursive();
    this.scheduleAutoIncrementTimeDiff();
  }

  scheduleFetchDataRecursive(): void {
    setInterval(() => {
      if (this.tokenStorage.isAutoRefresh()) {
        this.invalidateSupervisors();
        this.notificator.success('Data auto-refreshed');
      }
    }, 10 * 1000);
  }

  scheduleAutoIncrementTimeDiff(): void {
    setInterval(() => {
      this.setServerTimeDiff(this.getServerTimeDiff() + 1);
    }, 1000);
  }

  async resetDiffWhenActualDataIsFetched() {
    this.setServerTimeDiff(0);
  }

  updateAutoRefresh(active: boolean): void {
    if (active) {
      this.autoRefreshIsActive = true;
      this.tokenStorage.setAutoRefresh();
      this.notificator.success('Auto refresh enabled');
    } else {
      this.autoRefreshIsActive = false;
      this.tokenStorage.unsetAutoRefresh();
      this.notificator.success('Auto refresh disabled');
    }
  }

  switchAllowMutators(): void {
    if (this.tokenStorage.isAllowMutatorsEnabled()) {
      this.tokenStorage.unsetAllowMutatorsEnabled();
      this.isAllowMutatorsActive = false;
      this.notificator.success('Allow mutators disabled');
    } else {
      this.tokenStorage.setAllowMutatorsEnabled();
      this.isAllowMutatorsActive = true;
      this.notificator.success('Allow mutators enabled');
    }
  }

  getServerTimeDiff(): number {
    return this.serverTimeDiff;
  }

  setServerTimeDiff(value: number) {
    this.serverTimeDiff = value;
  }

  notifyErr(err: any) {
    this.notificator.error(err.message ?? 'Something went wrong: ' + '\n\n' + err.response.data.detail ?? 'No details');
  }

  checkValidResultSuccess(result: ApiSupervisorSupervisorManageResult): boolean {
    if (result?.operationResult) {
      if (result.operationResult.isFault) {
        this.notificator.error('Operation got fault: ' + result.operationResult.error);
      }

      return result.operationResult.ok;
    }

    if (result?.changedProcesses) {
      if (!result.changedProcesses.ok) {
        this.notificator.error('Got error while changing processes: ' + result.changedProcesses.error);
      }
      return result.changedProcesses.ok;
    }

    return false;
  }

  startProcess(server: ApiSupervisorServer, process: ApiProcess): void {
    this.manageSupervisors
      .mutateAsync({ server: server.name, type: 'start_process', group: process.group, process: process.name })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Process ${process.name} started on server ${server.name}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  stopProcess(server: ApiSupervisorServer, process: ApiProcess): void {
    this.manageSupervisors
      .mutateAsync({ server: server.name, type: 'stop_process', group: process.group, process: process.name })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Process ${process.name} stopped on server ${server.name}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  startProcessGroup(server: string, group: string): void {
    this.manageSupervisors
      .mutateAsync({ server: server, type: 'start_process_group', group: group, process: null })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Group ${group} started on server ${server}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  stopProcessGroup(server: string, group: string): void {
    this.manageSupervisors
      .mutateAsync({ server: server, type: 'stop_process_group', group: group, process: null })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Group ${group} stopped on server ${server}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  restartProcessGroup(server: string, group: string): void {
    this.manageSupervisors
      .mutateAsync({ server: server, type: 'restart_process_group', group: group, process: null })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Group ${group} restarted on server ${server}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  restartProcess(server: ApiSupervisorServer, process: ApiProcess): void {
    this.manageSupervisors
      .mutateAsync({ server: server.name, type: 'restart_process', group: process.group, process: process.name })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Process ${process.name} restarted on server ${server.name}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  clearProcessLog(server: ApiSupervisorServer, process: ApiProcess): void {
    this.manageSupervisors
      .mutateAsync({ server: server.name, type: 'clear_process_log', group: process.group, process: process.name })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Process ${process.name} log cleared on server ${server.name}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  cloneProcess(server: ApiSupervisorServer, process: ApiProcess): void {
    this.manageSupervisors
      .mutateAsync({ server: server.name, type: 'clone_process', group: process.group, process: process.name })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Process ${process.name} cloned on server ${server.name}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }

  removeProcess(server: ApiSupervisorServer, process: ApiProcess): void {
    this.manageSupervisors
      .mutateAsync({ server: server.name, type: 'remove_process', group: process.group, process: process.name })
      .then(result => {
        if (this.checkValidResultSuccess(result)) {
          this.notificator.success(`Process ${process.name} removed on server ${server.name}`);
        }
        this.invalidateSupervisors();
      })
      .catch(err => this.notifyErr(err));
  }
}
