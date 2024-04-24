import {fromPromise, IPromiseBasedObservable} from "mobx-utils";
import {apiControlClearAllProcessLogPost, apiControlClearProcessLogServerWorkerPost, apiControlCloneProcessServerWorkerPost, apiControlDataGet, apiControlRemoveProcessServerWorkerPost, apiControlRestartAllServerPost, apiControlRestartProcessGroup, apiControlRestartServerWorkerPost, apiControlStartAllServerPost, apiControlStartProcessGroup, apiControlStartServerWorkerPost, apiControlStopAllServerPost, apiControlStopProcessGroup, apiControlStopServerWorkerPost} from "../../api-client/api-client";
import {action, makeObservable, observable} from "mobx";
import {Notificator} from "./notificator";
import {TokenStorage} from "./token-storage";
import {AllProcessInfoDTO, WorkerDTO} from "../../api-client/generated";

export class LandingStore {

    prevData?: IPromiseBasedObservable<AllProcessInfoDTO[]>;
    actualData?: IPromiseBasedObservable<AllProcessInfoDTO[]>;

    autoRefreshIsActive: boolean;
    isDarkThemeActive: boolean;
    isAllowMutatorsActive: boolean;

    constructor(
            private notificator: Notificator,
            private tokenStorage: TokenStorage,
    ) {
        makeObservable(this, {
            actualData: observable,
            prevData: observable,

            autoRefreshIsActive: observable,
            isDarkThemeActive: observable,
            isAllowMutatorsActive: observable,

            fetchData: action,
            updateAutoRefresh: action,
            switchTheme: action,
            switchAllowMutators: action,
        });

        this.autoRefreshIsActive = this.tokenStorage.isAutoRefresh();
        this.isDarkThemeActive = this.tokenStorage.isDarkThemeEnabled();
        this.isAllowMutatorsActive = this.tokenStorage.isAllowMutatorsEnabled();

        this.scheduleFetchDataRecursive();
    }

    scheduleFetchDataRecursive(): void {
        setInterval(() => {
            if (this.tokenStorage.isAutoRefresh()) {
                this.fetchData();
                this.notificator.success('Data auto-refreshed');
            }
        }, 10 * 1000);
    }

    fetchData(): void {
        if (this.actualData?.state === 'pending') {
            console.log('already fetching');
            return;
        }

        if (this.actualData) {
            this.prevData = this.actualData;
        }

        this.actualData = fromPromise(apiControlDataGet());
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

    switchTheme(): void {
        if (this.tokenStorage.isDarkThemeEnabled()) {
            this.tokenStorage.unsetDarkThemeEnabled();
            document.querySelector('html')?.classList.remove('dark')
            this.isDarkThemeActive = false;
            this.notificator.success('Dark theme disabled');
        } else {
            this.tokenStorage.setDarkThemeEnabled();
            document.querySelector('html')?.classList.add('dark')
            this.isDarkThemeActive = true;
            this.notificator.success('Dark theme enabled');

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

    startAll(server: string): void {
        apiControlStartAllServerPost(server).then(() => {
            this.notificator.success(
                    `All processes started on server ${server}`
            )
            this.fetchData()
        }).catch((err) => {
            this.notificator.error(err.message)
        })
    }

    stopAll(server: string): void {
        apiControlStopAllServerPost(server).then(() => {
            this.notificator.success(
                    `All processes stopped on server ${server}`
            )
            this.fetchData()
        }).catch((err) => {
            this.notificator.error(err.message)
        })
    }

    restartAll(server: string): void {
        apiControlRestartAllServerPost(server).then(() => {
            this.notificator.success(
                    `All processes restarted on server ${server}`
            )
            this.fetchData()
        }).catch((err) => {
            this.notificator.error(err.message)
        })
    }

    clearAllProcessLog(server: string): void {
        apiControlClearAllProcessLogPost(server).then(() => {
            this.notificator.success(
                    `All process logs cleared on server ${server}`
            )
            this.fetchData()
        })
    }

    startProcess(worker: WorkerDTO): void {
        apiControlStartServerWorkerPost(worker).then(() => {
            this.notificator.success(
                    `Process ${worker.name} started on server ${worker.server}`
            )
            this.fetchData()
        }).catch((err) => {
            this.notificator.error(err.message)
        })
    }

    stopProcess(worker: WorkerDTO): void {
        apiControlStopServerWorkerPost(worker).then(() => {
            this.notificator.success(
                    `Process ${worker.name} stopped on server ${worker.server}`
            )
            this.fetchData()
        }).catch((err) => {
            this.notificator.error(err.message)
        })
    }

    startProcessGroup(server: string, group: string): void {
        apiControlStartProcessGroup(server, group).then(() => {
            this.notificator.success(
                    `Group ${group} started on server ${server}`
            )
            this.fetchData()
        })
    }

    stopProcessGroup(server: string, group: string): void {
        apiControlStopProcessGroup(server, group).then(() => {
            this.notificator.success(
                    `Group ${group} stopped on server ${server}`
            )
            this.fetchData()
        })
    }

    restartProcessGroup(server: string, group: string): void {
        apiControlRestartProcessGroup(server, group).then(() => {
            this.notificator.success(
                    `Group ${group} restarted on server ${server}`
            )
            this.fetchData()
        })
    }

    restartProcess(worker: WorkerDTO): void {
        apiControlRestartServerWorkerPost(worker).then(() => {
            this.notificator.success(
                    `Process ${worker.name} restarted on server ${worker.server}`
            )
            this.fetchData()
        }).catch((err) => {
            this.notificator.error(err.message)
        })
    }

    clearProcessLog(worker: WorkerDTO): void {
        apiControlClearProcessLogServerWorkerPost(worker).then(() => {
            this.notificator.success(
                    `Process ${worker.name} log cleared on server ${worker.server}`
            )
            this.fetchData()
        })
    }

    cloneProcess(worker: WorkerDTO): void {
        apiControlCloneProcessServerWorkerPost(worker).then(() => {
            this.notificator.success(
                    `Process ${worker.name} cloned on server ${worker.server}`
            )
            this.fetchData()
        })
    }

    removeProcess(worker: WorkerDTO): void {
        apiControlRemoveProcessServerWorkerPost(worker).then(() => {
            this.notificator.success(
                    `Process ${worker.name} removed on server ${worker.server}`
            )
            this.fetchData()
        })
    }
}
