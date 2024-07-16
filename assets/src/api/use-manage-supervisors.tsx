import { useMutation } from '@tanstack/react-query';
import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';
import { LandingStore } from '~/landing/stores/landing-store';

export const useManageSupervisors = (landingStore: LandingStore) =>
  useMutation({
    mutationKey: ['supervisors'],
    mutationFn: (manageData: ApiSupervisorSupervisorManage) =>
      $api
        .post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manageData)
        .then(response => {
          landingStore.setServerTimeDiff(0);
          return response.data;
        }),
  });
