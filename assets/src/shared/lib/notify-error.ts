import { toastManager } from '~/shared/lib/toastManager';

export const notifyError = (err: any) => {
  const heading = err.response.data.title ?? err.message ?? 'Something went wrong: '
  const details = err.response.data.detail ?? 'No details'

  toastManager.error(heading + '\n' + details)
}
