import { useStore } from '~/main/context-provider';
import { RiPlayFill, RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { Fragment } from 'react';
import { isHasRoleManager } from '~/app/providers/session/context';

export const Buttons = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  if (!isHasRoleManager()) {
    return <Fragment />;
  }

  const { landingStore } = useStore();
  const inactiveStates = ['STOPPED', 'EXITED', 'FATAL'];

  if (process.stateName === 'RUNNING') {
    return (
      <div className='flex space-x-1'>
        <button className='rounded bg-red-500 p-2 text-white' onClick={() => landingStore.stopProcess(server, process)}>
          <RiStopFill />
        </button>
        <button className='rounded bg-blue-500 p-2 text-white' onClick={() => landingStore.restartProcess(server, process)}>
          <TfiReload />
        </button>
      </div>
    );
  }

  if (inactiveStates.includes(process.stateName)) {
    return (
      <div className='flex space-x-1'>
        <button className='rounded bg-green-500 p-2 text-white' onClick={() => landingStore.startProcess(server, process)}>
          <RiPlayFill />
        </button>
      </div>
    );
  }

  return <div></div>;
};
