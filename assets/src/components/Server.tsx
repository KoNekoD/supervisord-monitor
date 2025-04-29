import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { isHasRoleManager } from '~/providers/session/context';
import { useClearAllProcessLog, useRestartAll, useStartAll, useStopAll } from '~/api/use-manage-supervisors';
import { trimIpPort } from '~/util/trimIpPort';
import { LockClosed } from '~/components/icons/LockClosed';
import { ShredFile } from '~/components/icons/ShredFile';
import { Play } from '~/components/icons/Play';
import { Stop } from '~/components/icons/Stop';
import { Reload } from '~/components/icons/Reload';
import { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';
import { Skull } from '~/components/icons/Skull';

import { Program } from '~/components/Program';

interface ServerProps {
  item: ApiSupervisor;
}

export const Server = ({ item }: ServerProps) => {
  const invalidateSupervisors = useInvalidateSupervisors();
  const hasRoleManager = isHasRoleManager();
  const startAll = useStartAll(item.server.name);
  const clearAllProcessLog = useClearAllProcessLog(item.server.name);
  const stopAll = useStopAll(item.server.name);
  const restartAll = useRestartAll(item.server.name);

  return (
    <div className='flex flex-col'>
      <div className='rounded-t-xl border-b border-l-2 border-r-2 border-t-2 border-gray-200 px-2 py-1'>
        <div className='space-x-2 lg:flex lg:justify-between'>
          <div className='flex w-full flex-wrap items-center justify-between'>
            <a href={item.server.webOpenUrl} className='pr-2 text-blue-400'>
              {item.server.name}
            </a>
            {item.ok ? (
              <div className='flex flex-wrap items-center space-x-1'>
                <a title={`${item.server.ip}:${item.server.port}`}>
                  {trimIpPort(item.server.ip, `:${item.server.port}`)}
                </a>
                <span>{item.server.authenticated && <LockClosed color='green' />}</span>
                <span>{item.version}</span>
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <span className='text-sm font-bold text-red-700'>error</span>
              </div>
            )}
          </div>
          {item.ok && hasRoleManager ? (
            <div className='flex justify-end'>
              <div className='flex items-center space-x-1 text-white'>
                <button
                  className='rounded bg-orange-500 p-2'
                  onClick={async () => {
                    await clearAllProcessLog.mutateAsync();
                    await invalidateSupervisors();
                  }}
                >
                  <ShredFile />
                </button>
                <button
                  className='rounded bg-green-500 p-2'
                  onClick={async () => {
                    await startAll.mutateAsync();
                    await invalidateSupervisors();
                  }}
                >
                  <Play />
                </button>
                <button
                  className='rounded bg-red-500 p-2'
                  onClick={async () => {
                    await stopAll.mutateAsync();
                    await invalidateSupervisors();
                  }}
                >
                  <Stop />
                </button>
                <button
                  className='rounded bg-blue-500 p-2'
                  onClick={async () => {
                    await restartAll.mutateAsync();
                    await invalidateSupervisors();
                  }}
                >
                  <Reload />
                </button>
              </div>
            </div>
          ) : (
            <Fragment />
          )}
        </div>
      </div>
      {item.ok ? (
        <div className='rounded-b-xl border-b-2 border-l-2 border-r-2 border-gray-200'>
          {item.groups.map((value, index) => {
            const notLast = index !== item.groups.length - 1;

            return (
              <div className={twMerge(notLast && 'border-b border-gray-200')} key={index}>
                <Program group={value} server={item.server} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className='inline-flex h-full w-full items-center rounded-b-xl border-b-2 border-l-2 border-r-2 border-gray-200 bg-red-100 px-6 py-5 text-red-700 dark:bg-transparent dark:text-red-600'>
          <span className='mr-2'>
            <Skull />
          </span>
          <div className='flex flex-col'>
            <span>Server is not available!</span>
            <span>Reason: {item.failError ?? 'Unknown error'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
