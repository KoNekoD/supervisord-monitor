import { $api } from 'src/api/api';
import { API_ENDPOINTS } from 'src/const';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSettings } from '~/hooks/useSettings';
import { useClock } from '~/providers/clock/context';

export const useGetSupervisors = () => {
  const { syncRefresh } = useSettings();
  const { setClock } = useClock();

  return useQuery({
    queryKey: ['getSupervisors'],
    queryFn: async () =>
      $api
        .get<ApiSupervisor[]>(API_ENDPOINTS.SUPERVISORS() + (syncRefresh ? '?sync-refresh=true' : ''))
        .then(response => {
          setClock(0);
          return response;
        }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
    retryDelay: 5000,
  });
};

export const useInvalidateSupervisors = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ['getSupervisors'],
    });
};
