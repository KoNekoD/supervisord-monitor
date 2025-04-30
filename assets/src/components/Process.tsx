import { useSettings } from '~/hooks/useSettings';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { isHasRoleManager } from '~/providers/session/context';
import {
  useClearProcessLog,
  useCloneProcess,
  useRemoveProcess,
  useRestartProcess,
  useStartProcess,
  useStopProcess,
} from '~/api/use-manage-supervisors';
import { Erase } from '~/components/icons/Erase';
import { Duplicate } from '~/components/icons/Duplicate';
import { Fragment, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Uptime } from '~/components/monitor/Uptime';
import { Stop } from '~/components/icons/Stop';
import { Reload } from '~/components/icons/Reload';
import { Play } from '~/components/icons/Play';
import { Booklet } from '~/components/icons/Booklet';
import { Warning } from '~/components/icons/Warning';
import { Close } from '~/components/icons/Close';

interface ProcessProps {
  process: ApiProcess;
  server: ApiSupervisorServer;
}

export const Process = ({ process, server }: ProcessProps) => {
  const { allowMutators } = useSettings();
  const invalidateSupervisors = useInvalidateSupervisors();
  const isManager = isHasRoleManager();

  const activateLog = (log: ApiProcessLog | null) => {
    setCurrentProcessLog(log);
    setShowLogsModal(true);
  };

  const [showLogsModal, setShowLogsModal] = useState(false);
  const [currentProcessLog, setCurrentProcessLog] = useState<ApiProcessLog | null>(null);
  const onActivateOutLog = () => activateLog(process.outLog);
  const onActivateErrLog = () => activateLog(process.errLog);

  const removeProcess = useRemoveProcess(server, process);
  const cloneProcess = useCloneProcess(server, process);
  const clearProcessLog = useClearProcessLog(server, process);
  const stopProcess = useStopProcess(server, process);
  const restartProcess = useRestartProcess(server, process);
  const startProcess = useStartProcess(server, process);

  const onRemoveProcess = async () => {
    await removeProcess.mutateAsync();
    await invalidateSupervisors();
  };

  const onCloneProcess = async () => {
    await cloneProcess.mutateAsync();
    await invalidateSupervisors();
  };

  const onClearProcessLog = async () => {
    await clearProcessLog.mutateAsync();
    await invalidateSupervisors();
    setShowLogsModal(false);
  };

  const onStopProcess = async () => {
    await stopProcess.mutateAsync();
    await invalidateSupervisors();
  };

  const onRestartProcess = async () => {
    await restartProcess.mutateAsync();
    await invalidateSupervisors();
  };

  const onStartProcess = async () => {
    await startProcess.mutateAsync();
    await invalidateSupervisors();
  };

  return (
    <div className='flex h-10 flex-row'>
      <div className='no-scrollbar mx-1 flex flex-grow items-center overflow-x-auto px-1'>
        <a className='program-title whitespace-nowrap' title={process.name}>
          {process.name}
        </a>
      </div>
      <div className='flex flex-nowrap items-center space-x-1'>
        {allowMutators && isManager ? (
          <div className='flex flex-nowrap space-x-1 text-white'>
            <button className='rounded bg-red-500 p-2' onClick={onRemoveProcess}>
              <Erase />
            </button>
            <button className='rounded bg-blue-500 p-2' onClick={onCloneProcess}>
              <Duplicate />
            </button>
          </div>
        ) : (
          <Fragment />
        )}
        <div>
          <div className='flex flex-nowrap space-x-1 text-white'>
            {process.outLog && (
              <button className='rounded bg-gray-500 px-2 py-2' type='button' onClick={onActivateOutLog}>
                <Booklet />
              </button>
            )}
            {process.errLog && (
              <button className='rounded bg-red-500 px-2 py-2' type='button' onClick={onActivateErrLog}>
                <Warning />
              </button>
            )}
          </div>
          {showLogsModal && currentProcessLog && (
            <div className='fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none'>
              <div className='m-8 flex max-h-[100%-1rem] max-w-[100%-1rem] flex-col rounded-xl bg-gray-100 dark:bg-gray-600'>
                <div className='flex items-center justify-between border-b-2 border-gray-100 p-4 dark:border-opacity-50'>
                  <h5 className='text-xl text-gray-800 dark:text-gray-200'>Log</h5>
                  <button type='button' className='h-10 hover:opacity-75' onClick={() => setShowLogsModal(false)}>
                    <Close />
                  </button>
                </div>
                <div className='relative overflow-y-auto p-4'>
                  {currentProcessLog.log.split('\n').map((item, index) => (
                    <p className='whitespace-nowrap' key={index}>
                      {item}
                    </p>
                  ))}
                </div>
                <div className='flex items-center justify-end border-t-2 border-gray-100 p-4 text-sm font-bold uppercase dark:border-opacity-50'>
                  <button
                    type='button'
                    onClick={() => setShowLogsModal(false)}
                    className='px-6 py-2 text-sm text-red-500'
                  >
                    Close
                  </button>
                  <button
                    type='button'
                    className='rounded bg-emerald-500 px-6 py-3 text-white'
                    onClick={onClearProcessLog}
                  >
                    Clear logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={'flex flex-col items-center'}>
          <span
            className={twMerge(
              'whitespace-nowrap rounded px-2 text-center text-xs font-bold',
              process.stateName === 'RUNNING'
                ? 'bg-green-100 text-green-700'
                : process.stateName === 'STARTING'
                  ? 'bg-blue-100 text-blue-800'
                  : process.stateName === 'FATAL'
                    ? 'bg-red-100 text-red-700'
                    : process.stateName === 'STOPPED'
                      ? 'bg-gray-800 text-gray-50'
                      : 'bg-yellow-100 text-yellow-800'
            )}
          >
            {process.stateName}
          </span>
          <Uptime process={process} />
        </div>
        <div>
          {isManager ? (
            (process.stateName === 'RUNNING' && (
              <div className='flex space-x-1'>
                <button className='rounded bg-red-500 p-2 text-white' onClick={onStopProcess}>
                  <Stop />
                </button>
                <button className='rounded bg-blue-500 p-2 text-white' onClick={onRestartProcess}>
                  <Reload />
                </button>
              </div>
            )) ||
            (['STOPPED', 'EXITED', 'FATAL'].includes(process.stateName) && (
              <div className='flex space-x-1'>
                <button className='rounded bg-green-500 p-2 text-white' onClick={onStartProcess}>
                  <Play />
                </button>
              </div>
            ))
          ) : (
            <Fragment />
          )}
        </div>
      </div>
    </div>
  );
};
