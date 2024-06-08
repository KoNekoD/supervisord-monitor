import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: async () => $api.get<ApiUser>(API_ENDPOINTS.ME()),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
    retryDelay: 5000,
  });

export const useInvalidateMe = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ['me'] });
};
