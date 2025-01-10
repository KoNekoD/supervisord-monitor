import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';

export const getSupervisors = (): Promise<ApiSupervisor[]> => $api.get<ApiSupervisor[]>(API_ENDPOINTS.SUPERVISORS()).then(response => response.data);
