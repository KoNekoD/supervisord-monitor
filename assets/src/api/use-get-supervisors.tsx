import { $api } from '~/shared/api';

export const getSupervisors = (): Promise<ApiSupervisor[]> =>
  $api.get<ApiSupervisor[]>(`/supervisors`).then(response => response.data);
