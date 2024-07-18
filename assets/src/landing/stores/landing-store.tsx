import { action, makeObservable, observable } from 'mobx';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { toastManager } from '~/shared/lib/toastManager';
import { manageTokenStorage } from '~/shared/lib/token-storage';

let setServerTimeDiffFn: (value: number) => void = () => {};

export class LandingStore {
  autoRefreshIsActive: boolean;
  isAllowMutatorsActive: boolean;
  serverTimeDiff: number;
  invalidateSupervisors: ReturnType<typeof useInvalidateSupervisors>;

  constructor() {
    makeObservable(this, {
      autoRefreshIsActive: observable,
      isAllowMutatorsActive: observable,
      serverTimeDiff: observable,
      updateAutoRefresh: action,
      switchAllowMutators: action,
      setServerTimeDiff: action,
    });

    this.autoRefreshIsActive = manageTokenStorage.isAutoRefresh();
    this.isAllowMutatorsActive = manageTokenStorage.isAllowMutatorsEnabled();
    this.serverTimeDiff = 0;

    this.invalidateSupervisors = useInvalidateSupervisors();

    this.scheduleFetchDataRecursive();
    this.scheduleAutoIncrementTimeDiff();

    setServerTimeDiffFn = this.setServerTimeDiff
  }

  scheduleFetchDataRecursive(): void {
    setInterval(() => {
      if (manageTokenStorage.isAutoRefresh()) {
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

  updateAutoRefresh(active: boolean): void {
    if (active) {
      this.autoRefreshIsActive = true;
      manageTokenStorage.setAutoRefresh();
      toastManager.success('Auto refresh enabled');
    } else {
      this.autoRefreshIsActive = false;
      manageTokenStorage.unsetAutoRefresh();
      toastManager.success('Auto refresh disabled');
    }
  }

  switchAllowMutators(): void {
    if (manageTokenStorage.isAllowMutatorsEnabled()) {
      manageTokenStorage.unsetAllowMutatorsEnabled();
      this.isAllowMutatorsActive = false;
      toastManager.success('Allow mutators disabled');
    } else {
      manageTokenStorage.setAllowMutatorsEnabled();
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
