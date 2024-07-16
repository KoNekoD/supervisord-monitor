import { RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';

export const Running = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  const { stopProcessGroup, restartProcessGroup } = useOperationsSupervisors();

  return (
    <div className='flex space-x-1'>
      <button className='rounded bg-red-500 p-2 text-white' onClick={() => stopProcessGroup(server.name, group.name)}>
        <RiStopFill />
      </button>
      <button
        className='rounded bg-blue-500 p-2 text-white'
        onClick={() => restartProcessGroup(server.name, group.name)}
      >
        <TfiReload />
      </button>
    </div>
  );
};
