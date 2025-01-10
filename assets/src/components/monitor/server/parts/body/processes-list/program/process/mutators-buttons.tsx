import { GrErase } from 'react-icons/gr';
import { GoDuplicate } from 'react-icons/go';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';
import { isHasRoleManager } from '~/app/providers/session/context';
import { Fragment } from 'react';

export const MutatorsButtons = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  if (!isHasRoleManager()) {
    return <Fragment />;
  }

  const { removeProcess, cloneProcess } = useOperationsSupervisors();

  return (
    <div className='flex flex-nowrap space-x-1 text-white'>
      <button
        className='rounded bg-red-500 p-2'
        onClick={() => removeProcess(server.name, process.group, process.name)}
      >
        <GrErase />
      </button>
      <button
        className='rounded bg-blue-500 p-2'
        onClick={() => cloneProcess(server.name, process.group, process.name)}
      >
        <GoDuplicate />
      </button>
    </div>
  );
};
