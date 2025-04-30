import { $api } from 'src/api/api';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from 'src/const';

export const useLogin = () =>
  useMutation({
    mutationFn: (data: ApiUserAuthByCredentialsDTO) => $api.post(API_ENDPOINTS.LOGIN(), data),
  });
