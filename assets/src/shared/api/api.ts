import axios from 'axios';

import { ENV } from '~/shared/config';

export const $api = axios.create({
  baseURL: ENV.VITE_API_URL,
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
  withCredentials: true,
});
