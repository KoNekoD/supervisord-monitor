import {AllProcessInfoDTO, WorkerDTO} from "./generated";
import axios from "axios";

// const HOST: string = 'http://localhost:8080';
const HOST: string = ''; // For prod

export const apiControlClearProcessLogServerWorkerPost = (worker: WorkerDTO): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/clearProcessLog`, worker)
            .then((response) => response.data);
}

export const apiControlCloneProcessServerWorkerPost = (worker: WorkerDTO): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/cloneProcess`, worker)
            .then((response) => response.data);
}

export const apiControlRemoveProcessServerWorkerPost = (worker: WorkerDTO): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/removeProcess`, worker)
            .then((response) => response.data);
}

export const apiControlClearAllProcessLogPost = (server: string): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/clearAllProcessLog/${server}`,)
            .then((response) => response.data);
}

export const apiControlDataGet = (): Promise<AllProcessInfoDTO[]> => {
    return axios
            .get<AllProcessInfoDTO[]>(`${HOST}/api/control/data`)
            .then((response) => response.data);
}

export const apiControlRestartServerWorkerPost = (worker: WorkerDTO): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/restart`, worker)
            .then((response) => response.data);
}

export const apiControlRestartAllServerPost = (server: string): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/restartAll/${server}`)
            .then((response) => response.data);
}

export const apiControlStartServerWorkerPost = (worker: WorkerDTO): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/start`, worker)
            .then((response) => response.data);
}

export const apiControlStartAllServerPost = (server: string): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/startAll/${server}`)
            .then((response) => response.data);
}

export const apiControlStopServerWorkerPost = (worker: WorkerDTO): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/stop`, worker)
            .then((response) => response.data);
}

export const apiControlStartProcessGroup = (server: string, group: string): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/startProcessGroup/${server}/${group}`)
            .then((response) => response.data);
}

export const apiControlStopProcessGroup = (server: string, group: string): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/stopProcessGroup/${server}/${group}`)
            .then((response) => response.data);
}

export const apiControlRestartProcessGroup = (server: string, group: string): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/restartProcessGroup/${server}/${group}`)
            .then((response) => response.data);
}

export const apiControlStopAllServerPost = (server: string): Promise<null> => {
    return axios
            .post<null>(`${HOST}/api/control/stopAll/${server}`)
            .then((response) => response.data);
}
