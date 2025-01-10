import { $api } from '~/shared/api';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '~/shared/const';

export const useLogout = () =>
  useMutation({
    mutationFn: () => $api.post(API_ENDPOINTS.LOGOUT(), []),
  });
