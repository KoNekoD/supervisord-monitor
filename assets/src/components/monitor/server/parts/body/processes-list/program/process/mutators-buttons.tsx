import { useStore } from '~/main/context-provider';
import { GrErase } from 'react-icons/gr';
import { GoDuplicate } from 'react-icons/go';
import { isHasRoleManager } from '~/app/providers/session/context';
import { Fragment } from 'react';

export const MutatorsButtons = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  const { landingStore } = useStore();
  if (!isHasRoleManager()) {
    return <Fragment />;
  }

  return (
    <div className='flex flex-nowrap space-x-1 text-white'>
      <button className='rounded bg-red-500 p-2' onClick={() => landingStore.removeProcess(server, process)}>
        <GrErase />
      </button>
      <button className='rounded bg-blue-500 p-2' onClick={() => landingStore.cloneProcess(server, process)}>
        <GoDuplicate />
      </button>
    </div>
  );
};
