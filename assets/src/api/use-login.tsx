import { $api } from '~/shared/api';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from '~/shared/const';

export const useLogin = () =>
  useMutation({
    mutationFn: (data: ApiUserAuthByCredentialsDTO) => $api.post(API_ENDPOINTS.LOGIN(), data),
  });
