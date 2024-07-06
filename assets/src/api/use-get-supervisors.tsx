import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useGetSupervisors = () =>
  useQuery({
    queryKey: ['supervisors'],
    queryFn: () => $api.get<ApiSupervisor[]>(API_ENDPOINTS.SUPERVISORS()),
  });

export const useInvalidateSupervisors = () => {
  const queryClient = useQueryClient();

  const revalidatingNotification = (promise: Promise<void>) => {
    toast.promise(promise, {
      loading: 'Revalidating...',
      success: 'Revalidated!',
      error: 'Revalidation failed!',
    });
  };

  return () => revalidatingNotification(queryClient.invalidateQueries({ queryKey: ['supervisors'] }));
};
