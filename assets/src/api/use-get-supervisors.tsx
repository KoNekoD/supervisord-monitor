import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';

export const getSupervisors = (syncRefreshIsActive: boolean): Promise<ApiSupervisor[]> => $api.get<ApiSupervisor[]>(API_ENDPOINTS.SUPERVISORS()+(syncRefreshIsActive ? '?sync-refresh=true' : '')).then(response => response.data);
