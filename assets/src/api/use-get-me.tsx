import { $api } from '~/shared/api';
import { API_ENDPOINTS } from '~/shared/const';

export const getMe = () => $api.get<ApiUser>(API_ENDPOINTS.ME());
