import { IPromiseBasedObservable } from 'mobx-utils';
import { action, makeObservable, observable } from 'mobx';
import { TokenStorage } from './token-storage';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { toastManager } from '~/shared/lib/toastManager';

export class LandingStore {
  prevData?: IPromiseBasedObservable<ApiSupervisor[]>;
  actualData?: IPromiseBasedObservable<ApiSupervisor[]>;

  autoRefreshIsActive: boolean;
  isAllowMutatorsActive: boolean;
  serverTimeDiff: number;
  invalidateSupervisors: ReturnType<typeof useInvalidateSupervisors>;

  constructor(private tokenStorage: TokenStorage) {
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

    this.invalidateSupervisors = useInvalidateSupervisors();

    this.scheduleFetchDataRecursive();
    this.scheduleAutoIncrementTimeDiff();
  }

  scheduleFetchDataRecursive(): void {
    setInterval(() => {
      if (this.tokenStorage.isAutoRefresh()) {
        this.invalidateSupervisors();
        toastManager.success('Data auto-refreshed');
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
      toastManager.success('Auto refresh enabled');
    } else {
      this.autoRefreshIsActive = false;
      this.tokenStorage.unsetAutoRefresh();
      toastManager.success('Auto refresh disabled');
    }
  }

  switchAllowMutators(): void {
    if (this.tokenStorage.isAllowMutatorsEnabled()) {
      this.tokenStorage.unsetAllowMutatorsEnabled();
      this.isAllowMutatorsActive = false;
      toastManager.success('Allow mutators disabled');
    } else {
      this.tokenStorage.setAllowMutatorsEnabled();
      this.isAllowMutatorsActive = true;
      toastManager.success('Allow mutators enabled');
    }
  }

  getServerTimeDiff(): number {
    return this.serverTimeDiff;
  }

  setServerTimeDiff(value: number) {
    this.serverTimeDiff = value;
  }
}
