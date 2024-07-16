import { useMutation } from '@tanstack/react-query';
import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';

export const useManageSupervisors = () =>
  useMutation({
    mutationKey: ['supervisors'],
    mutationFn: (manageData: ApiSupervisorSupervisorManage) =>
      $api
        .post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manageData)
        .then(response => response.data),
  });
