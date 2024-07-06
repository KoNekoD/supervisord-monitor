import { LOCAL_STORAGE_KEYS } from '~/shared/const/local-storage-keys';

export type TokenStorageType = {
  setAutoRefresh(): void;
  unsetAutoRefresh(): void;
  isAutoRefresh(): boolean;

  setAllowMutatorsEnabled(): void;
  unsetAllowMutatorsEnabled(): void;
  isAllowMutatorsEnabled(): boolean;
};

export const manageTokenStorage: TokenStorageType = {
  setAutoRefresh(): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTO_REFRESH, '1');
  },

  unsetAutoRefresh(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTO_REFRESH);
  },

  isAutoRefresh(): boolean {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTO_REFRESH) === '1';
  },

  setAllowMutatorsEnabled(): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ALLOW_MUTATORS_ENABLED, '1');
  },

  unsetAllowMutatorsEnabled(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ALLOW_MUTATORS_ENABLED);
  },

  isAllowMutatorsEnabled(): boolean {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ALLOW_MUTATORS_ENABLED) === '1';
  },
};
