import { API_ENDPOINTS } from 'src/const';
import { $api } from 'src/api/api';
import { toastManager } from '~/util/toastManager';
import { useMutation } from '@tanstack/react-query';
import { checkSupervisorManageResult } from '~/util/checkSupervisorManageResult';

function notifyErr(err: any) {
  toastManager.error(err.message ?? 'Something went wrong: ' + '\n\n' + err.response.data.detail ?? 'No details');
}

export function useStartAll(server: string) {
  const manage = { server: server, type: 'start_all_processes', group: null, process: null };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`All processes started on server ${server}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useStopAll(server: string) {
  const manage = { server: server, type: 'stop_all_processes', group: null, process: null };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`All processes stopped on server ${server}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useRestartAll(server: string) {
  const manage = { server: server, type: 'restart_all_processes', group: null, process: null };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`All processes restarted on server ${server}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useClearAllProcessLog(server: string) {
  const manage = { server: server, type: 'clear_all_process_log', group: null, process: null };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`All process logs cleared on server ${server}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useStartProcess(server: ApiSupervisorServer, process: ApiProcess) {
  const manage = { server: server.name, type: 'start_process', group: process.group, process: process.name };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Process ${process.name} started on server ${server.name}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useStopProcess(server: ApiSupervisorServer, process: ApiProcess) {
  const manage = { server: server.name, type: 'stop_process', group: process.group, process: process.name };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Process ${process.name} stopped on server ${server.name}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useStartProcessGroup(server: string, group: string) {
  const manage = { server: server, type: 'start_process_group', group: group, process: null };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Group ${group} started on server ${server}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useStopProcessGroup(server: string, group: string) {
  const manage = { server: server, type: 'stop_process_group', group: group, process: null };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Group ${group} stopped on server ${server}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useRestartProcessGroup(server: string, group: string) {
  const manage = { server: server, type: 'restart_process_group', group: group, process: null };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Group ${group} restarted on server ${server}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useRestartProcess(server: ApiSupervisorServer, process: ApiProcess) {
  const manage = { server: server.name, type: 'restart_process', group: process.group, process: process.name };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Process ${process.name} restarted on server ${server.name}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useClearProcessLog(server: ApiSupervisorServer, process: ApiProcess) {
  const manage = { server: server.name, type: 'clear_process_log', group: process.group, process: process.name };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Process ${process.name} log cleared on server ${server.name}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useCloneProcess(server: ApiSupervisorServer, process: ApiProcess) {
  const manage = { server: server.name, type: 'clone_process', group: process.group, process: process.name };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Process ${process.name} cloned on server ${server.name}`);
      }
    },
    onError: err => notifyErr(err),
  });
}

export function useRemoveProcess(server: ApiSupervisorServer, process: ApiProcess) {
  const manage = { server: server.name, type: 'remove_process', group: process.group, process: process.name };

  return useMutation({
    mutationFn: () => $api.post<ApiSupervisorSupervisorManageResult>(API_ENDPOINTS.MANAGE_SUPERVISORS(), manage),
    onSuccess: result => {
      if (checkSupervisorManageResult(result.data)) {
        toastManager.success(`Process ${process.name} removed on server ${server.name}`);
      }
    },
    onError: err => notifyErr(err),
  });
}
