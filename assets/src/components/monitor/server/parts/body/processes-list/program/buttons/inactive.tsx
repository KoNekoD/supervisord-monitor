import { useStore } from '~/main/context-provider';
import { RiPlayFill } from 'react-icons/ri';

export const Inactive = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  const { landingStore } = useStore();

  return (
    <div className='flex space-x-1'>
      <button className='rounded bg-green-500 p-2 text-white' onClick={() => landingStore.startProcessGroup(server.name, group.name)}>
        <RiPlayFill />
      </button>
    </div>
  );
};
