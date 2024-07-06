import { useManageSupervisors } from '~/api/use-manage-supervisors';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { checkValidResultSuccess } from '~/shared/lib/check-valid-result-success';
import toast from 'react-hot-toast';
import { notifyError } from '~/shared/lib/notify-error';

export const useOperationsSupervisors = () => {
  const manageSupervisors = useManageSupervisors();
  const invalidateSupervisors = useInvalidateSupervisors();

  const clearAllProcessLog = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'clear_all_process_log',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All process logs cleared on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const startAll = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'start_all_processes',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All processes started on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const stopAll = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'stop_all_processes',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All processes stopped on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const restartAll = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'restart_all_processes',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All processes restarted on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  return { clearAllProcessLog, startAll, stopAll, restartAll };
};
