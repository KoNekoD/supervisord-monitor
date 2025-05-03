import { $api } from 'src/api/api';
import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS } from 'src/const';

export const useLogout = () =>
  useMutation({
    mutationFn: () => $api.post(API_ENDPOINTS.LOGOUT(), []),
  });
