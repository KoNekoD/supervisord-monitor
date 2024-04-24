import {makeAutoObservable} from "mobx";

export type TokenStorageType = {
    setAutoRefresh(): void;
    unsetAutoRefresh(): void;
    isAutoRefresh(): boolean;

    setDarkThemeEnabled(): void;
    unsetDarkThemeEnabled(): void;
    isDarkThemeEnabled(): boolean;

    setAllowMutatorsEnabled(): void;
    unsetAllowMutatorsEnabled(): void;
    isAllowMutatorsEnabled(): boolean;
};

export class TokenStorage implements TokenStorageType {
    constructor(
            private autoRefreshKey: string,
            private darkThemeEnabledKey: string,
            private allowMutatorsEnabledKey: string,
    ) {
        makeAutoObservable(this);
    }

    /** Auto refresh */
    setAutoRefresh(): void {
        localStorage.setItem(this.autoRefreshKey, '1');
    }

    unsetAutoRefresh(): void {
        localStorage.removeItem(this.autoRefreshKey);
    }

    isAutoRefresh(): boolean {
        return localStorage.getItem(this.autoRefreshKey) === '1';
    }

    /** Dark theme */
    setDarkThemeEnabled(): void {
        localStorage.setItem(this.darkThemeEnabledKey, '1');
    }

    unsetDarkThemeEnabled(): void {
        localStorage.removeItem(this.darkThemeEnabledKey);
    }

    isDarkThemeEnabled(): boolean {
        return localStorage.getItem(this.darkThemeEnabledKey) === '1';
    }

    /* Allow Mutators */
    setAllowMutatorsEnabled(): void {
        localStorage.setItem(this.allowMutatorsEnabledKey, '1');
    }

    unsetAllowMutatorsEnabled(): void {
        localStorage.removeItem(this.allowMutatorsEnabledKey);
    }

    isAllowMutatorsEnabled(): boolean {
        return localStorage.getItem(this.allowMutatorsEnabledKey) === '1';
    }
}
