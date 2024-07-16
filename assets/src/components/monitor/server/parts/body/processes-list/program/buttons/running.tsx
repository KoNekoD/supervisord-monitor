import { RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';
import { useStore } from '~/main/context-provider';

export const Running = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  const {landingStore} = useStore();
  const { stopProcessGroup, restartProcessGroup } = useOperationsSupervisors(landingStore);

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
