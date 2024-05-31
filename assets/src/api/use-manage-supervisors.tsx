import { $api } from '~/shared/api';

export const manageSupervisor = (manage: ApiSupervisorSupervisorManage): Promise<ApiSupervisorSupervisorManageResult> =>
  $api.post<ApiSupervisorSupervisorManageResult>(`/supervisors/manage`, manage).then(response => response.data);
