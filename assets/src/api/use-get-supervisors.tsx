import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toastManager } from '~/shared/lib/toastManager';
import { LandingStore } from '~/landing/stores/landing-store';

export const useGetSupervisors = () =>
  useQuery({
    queryKey: ['supervisors'],
    queryFn: () => $api.get<ApiSupervisor[]>(API_ENDPOINTS.SUPERVISORS()),
  });

export const useInvalidateSupervisors = (landingStore: LandingStore) => {
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
