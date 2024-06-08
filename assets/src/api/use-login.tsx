import { $api } from '~/shared/api';

export const login = (data: ApiUserAuthByCredentialsDTO) => $api.post('/auth/login', data);
