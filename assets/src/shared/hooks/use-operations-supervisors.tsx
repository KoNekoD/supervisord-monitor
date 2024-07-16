import { useManageSupervisors } from '~/api/use-manage-supervisors';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { checkValidResultSuccess } from '~/shared/lib/check-valid-result-success';
import { notifyError } from '~/shared/lib/notify-error';
import { toastManager } from '~/shared/lib/toastManager';
import { LandingStore } from '~/landing/stores/landing-store';

export const useOperationsSupervisors = (landingStore: LandingStore) => {
  const manageSupervisors = useManageSupervisors(landingStore);
  const invalidateSupervisors = useInvalidateSupervisors(landingStore);

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
          toastManager.success(`All process logs cleared on server ${serverName}`);
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
          toastManager.success(`All processes started on server ${serverName}`);
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
          toastManager.success(`All processes stopped on server ${serverName}`);
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
          toastManager.success(`All processes restarted on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const startProcess = (serverName: string, groupName: string, processName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'start_process',
        group: groupName,
        process: processName,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Process ${processName} started on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const stopProcess = (serverName: string, groupName: string, processName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'stop_process',
        group: groupName,
        process: processName,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Process ${processName} stopped on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const restartProcess = (serverName: string, groupName: string, processName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'restart_process',
        group: groupName,
        process: processName,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Process ${processName} restarted on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const startProcessGroup = (serverName: string, groupName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'start_process_group',
        group: groupName,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Group ${groupName} started on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const stopProcessGroup = (serverName: string, groupName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'stop_process_group',
        group: groupName,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Group ${groupName} stopped on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const restartProcessGroup = (serverName: string, groupName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'restart_process_group',
        group: groupName,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Group ${groupName} restarted on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const clearProcessLog = (serverName: string, groupName: string, processName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'clear_process_log',
        group: groupName,
        process: processName,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Process ${processName} log cleared on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const cloneProcess = (serverName: string, groupName: string, processName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'clone_process',
        group: groupName,
        process: processName,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Process ${processName} cloned on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const removeProcess = (serverName: string, groupName: string, processName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'remove_process',
        group: groupName,
        process: processName,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toastManager.success(`Process ${processName} removed on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  return {
    clearAllProcessLog,
    startAll,
    stopAll,
    restartAll,
    startProcess,
    stopProcess,
    restartProcess,
    startProcessGroup,
    stopProcessGroup,
    restartProcessGroup,
    clearProcessLog,
    cloneProcess,
    removeProcess,
  };
};
