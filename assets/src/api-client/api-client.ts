import axios from "axios";

// const HOST: string = 'http://localhost:8080';
const HOST: string = ''; // For prod

export const getSupervisors = (): Promise<ApiSupervisor[]> => {
    return axios.get<ApiSupervisor[]>(`${HOST}/api/supervisors`).then(response => response.data);
};

export const manageSupervisor = (manage: ApiSupervisorSupervisorManage): Promise<ApiSupervisorSupervisorManageResult> => {
    return axios.post<ApiSupervisorSupervisorManageResult>(`${HOST}/api/supervisors/manage`, manage).then(response => response.data);
};
