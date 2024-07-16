import { RiPlayFill } from 'react-icons/ri';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';
import { useStore } from '~/main/context-provider';

export const Inactive = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  const {landingStore} = useStore();
  const { startProcessGroup } = useOperationsSupervisors(landingStore);

  return (
    <div className='flex space-x-1'>
      <button
        className='rounded bg-green-500 p-2 text-white'
        onClick={() => startProcessGroup(server.name, group.name)}
      >
        <RiPlayFill />
      </button>
    </div>
  );
};
