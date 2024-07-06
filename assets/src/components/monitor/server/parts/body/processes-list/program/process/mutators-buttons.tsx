import { GrErase } from 'react-icons/gr';
import { GoDuplicate } from 'react-icons/go';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';

export const MutatorsButtons = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  const { removeProcess, cloneProcess } = useOperationsSupervisors();

  return (
    <div className='flex flex-nowrap space-x-1 text-white'>
      <button
        className='rounded bg-red-500 p-2'
        onClick={removeProcess.bind(null, server.name, process.group, process.name)}
      >
        <GrErase />
      </button>
      <button
        className='rounded bg-blue-500 p-2'
        onClick={cloneProcess.bind(null, server.name, process.group, process.name)}
      >
        <GoDuplicate />
      </button>
    </div>
  );
};
