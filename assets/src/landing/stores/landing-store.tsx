import { action, makeObservable, observable } from 'mobx';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { toastManager } from '~/shared/lib/toastManager';
import { manageTokenStorage } from '~/shared/lib/token-storage';

let lastScheduleFetchDataRecursiveId = 0;

export class LandingStore {
  autoRefresh: boolean;
  allowMutators: boolean;
  invalidateSupervisors: ReturnType<typeof useInvalidateSupervisors>;

  constructor() {
    makeObservable(this, {
      autoRefresh: observable,
      allowMutators: observable,
      updateAutoRefresh: action,
      switchAllowMutators: action,
    });

    this.autoRefresh = manageTokenStorage.isAutoRefresh();
    this.allowMutators = manageTokenStorage.isAllowMutatorsEnabled();
    this.invalidateSupervisors = useInvalidateSupervisors();

    this.scheduleFetchDataRecursive();
  }

  scheduleFetchDataRecursive(): void {
    clearInterval(lastScheduleFetchDataRecursiveId);
    lastScheduleFetchDataRecursiveId = setInterval(() => {
      if (manageTokenStorage.isAutoRefresh()) {
        this.invalidateSupervisors();
        toastManager.success('Data auto-refreshed');
      }
    }, 10 * 1000);
  }

  updateAutoRefresh(active: boolean): void {
    this.autoRefresh = active;
    if (active) {
      manageTokenStorage.setAutoRefresh();
      toastManager.success('Auto refresh enabled');
    } else {
      manageTokenStorage.unsetAutoRefresh();
      toastManager.success('Auto refresh disabled');
    }
  }

  switchAllowMutators(): void {
    if (manageTokenStorage.isAllowMutatorsEnabled()) {
      manageTokenStorage.unsetAllowMutatorsEnabled();
      toastManager.success('Allow mutators disabled');
    } else {
      manageTokenStorage.setAllowMutatorsEnabled();
      toastManager.success('Allow mutators enabled');
    }
    this.allowMutators = manageTokenStorage.isAllowMutatorsEnabled();
  }
}
