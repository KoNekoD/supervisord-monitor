import { RiPlayFill } from 'react-icons/ri';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';

export const Inactive = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  const { startProcessGroup } = useOperationsSupervisors();

  return (
    <div className='flex space-x-1'>
      <button
        className='rounded bg-green-500 p-2 text-white'
        onClick={startProcessGroup.bind(null, server.name, group.name)}
      >
        <RiPlayFill />
      </button>
    </div>
  );
};
