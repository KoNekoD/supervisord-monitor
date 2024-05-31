import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';

export const manageSupervisor = (manage: ApiSupervisorSupervisorManage): Promise<ApiSupervisorSupervisorManageResult> =>
  $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage).then(response => response.data);
