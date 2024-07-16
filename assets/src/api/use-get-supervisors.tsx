import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { toastManager } from '~/shared/lib/toastManager';
import { AxiosResponse } from 'axios';

export const useGetSupervisors = (): UseQueryResult<AxiosResponse<ApiSupervisor[]>> =>
  useQuery({
    queryKey: ['supervisors'],
    queryFn: () => $api.get<ApiSupervisor[]>(API_ENDPOINTS.SUPERVISORS()),
  });

export const useInvalidateSupervisors = () => {
  const queryClient = useQueryClient();

  const revalidatingNotification = (promise: Promise<void>) => {
    toastManager.promise(promise, {
      loading: 'Updating servers data...',
      success: 'Servers data updated',
      error: 'Error updating servers data',
    });
  };

  return () => revalidatingNotification(queryClient.invalidateQueries({ queryKey: ['supervisors'] }));
};
