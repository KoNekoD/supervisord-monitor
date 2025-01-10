import toast from 'react-hot-toast';

export const checkValidResultSuccess = (result: ApiSupervisorSupervisorManageResult): boolean => {
  if (result?.operationResult) {
    if (result.operationResult.isFault) {
      toast.error('Operation got fault: ' + result.operationResult.error);
    }

    return result.operationResult.ok;
  }

  if (result?.changedProcesses) {
    if (!result.changedProcesses.ok) {
      toast.error('Got error while changing processes: ' + result.changedProcesses.error);
    }
    return result.changedProcesses.ok;
  }

  return false;
};
