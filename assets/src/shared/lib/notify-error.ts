import { toastManager } from '~/shared/lib/toastManager';

export const notifyError = (err: any) =>
  toastManager.error(err.message ?? 'Something went wrong: ' + '\n\n' + err.response.data.detail ?? 'No details');
