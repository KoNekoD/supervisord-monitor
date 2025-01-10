import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetSupervisors = () =>
  useQuery({
    queryKey: ['supervisors'],
    queryFn: () => $api.get<ApiSupervisor[]>(API_ENDPOINTS.SUPERVISORS()),
  });

export const useInvalidateSupervisors = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ['supervisors'] });
};
