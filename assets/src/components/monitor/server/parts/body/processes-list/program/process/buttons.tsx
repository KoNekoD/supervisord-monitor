import { RiPlayFill, RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';
import { Fragment } from 'react';
import { isHasRoleManager } from '~/app/providers/session/context';

export const Buttons = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  if (!isHasRoleManager()) {
    return <Fragment />;
  }

  const { startProcess, stopProcess, restartProcess } = useOperationsSupervisors();

  const inactiveStates = ['STOPPED', 'EXITED', 'FATAL'];

  if (process.stateName === 'RUNNING') {
    return (
      <div className='flex space-x-1'>
        <button
          className='rounded bg-red-500 p-2 text-white'
          onClick={stopProcess.bind(null, server.name, process.group, process.name)}
        >
          <RiStopFill />
        </button>
        <button
          className='rounded bg-blue-500 p-2 text-white'
          onClick={restartProcess.bind(null, server.name, process.group, process.name)}
        >
          <TfiReload />
        </button>
      </div>
    );
  }

  if (inactiveStates.includes(process.stateName)) {
    return (
      <div className='flex space-x-1'>
        <button
          className='rounded bg-green-500 p-2 text-white'
          onClick={startProcess.bind(null, server.name, process.group, process.name)}
        >
          <RiPlayFill />
        </button>
      </div>
    );
  }

  return <div></div>;
};
