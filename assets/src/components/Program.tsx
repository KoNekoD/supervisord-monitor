import { Fragment, useState } from 'react';
import { isHasRoleManager } from '~/providers/session/context';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';
import { useRestartProcessGroup, useStartProcessGroup, useStopProcessGroup } from '~/api/use-manage-supervisors';
import { ChevronUp } from '~/components/icons/ChevronUp';
import { ChevronDown } from '~/components/icons/ChevronDown';
import { Stop } from '~/components/icons/Stop';
import { Reload } from '~/components/icons/Reload';
import { Play } from '~/components/icons/Play';

import { Process } from '~/components/Process';

interface ProgramProps {
  group: ApiProcessGroup;
  server: ApiSupervisorServer;
}

export const Program = ({ group, server }: ProgramProps) => {
  const [isActive, setIsActive] = useState(false);

  const isManager = isHasRoleManager();

  const isNoGroup = group.processes.length === 1 && isNaN(Number(group.processes[0].name));
  const isSomeRunning = group.processes.some(process => process.stateName === 'RUNNING');

  const invalidateSupervisors = useInvalidateSupervisors();

  const stopProcessGroup = useStopProcessGroup(server.name, group.name);
  const restartProcessGroup = useRestartProcessGroup(server.name, group.name);
  const startProcessGroup = useStartProcessGroup(server.name, group.name);

  const onGroupClick = () => {
    setIsActive(!isActive);
  };

  const onStopGroup = async () => {
    await stopProcessGroup.mutateAsync();
    await invalidateSupervisors();
  };

  const onRestartGroup = async () => {
    await restartProcessGroup.mutateAsync();
    await invalidateSupervisors();
  };

  const onStartGroup = async () => {
    await startProcessGroup.mutateAsync();
    await invalidateSupervisors();
  };

  return (
    <div className='px-2 py-1'>
      {!isNoGroup && (
        <div className='flex items-center space-x-2'>
          <div>
            <div className='program-title flex cursor-pointer items-center space-x-2' onClick={onGroupClick}>
              {isActive ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              <div>
                <a>{group.name}</a>
              </div>
            </div>
          </div>
          <div className='flex flex-grow items-center justify-end'>
            {isManager ? (
              <div className='flex space-x-1'>
                {isSomeRunning ? (
                  <>
                    <button className='rounded bg-red-500 p-2 text-white' onClick={onStopGroup}>
                      <Stop />
                    </button>
                    <button className='rounded bg-blue-500 p-2 text-white' onClick={onRestartGroup}>
                      <Reload />
                    </button>
                  </>
                ) : (
                  <button className='rounded bg-green-500 p-2 text-white' onClick={onStartGroup}>
                    <Play />
                  </button>
                )}
              </div>
            ) : (
              <Fragment />
            )}
          </div>
        </div>
      )}
      {(isActive || isNoGroup) &&
        group.processes.map((process, i) => <Process key={i} process={process} server={server} />)}
    </div>
  );
};
