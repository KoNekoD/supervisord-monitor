import { RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { useStore } from '~/main/context-provider';

export const Running = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  const { landingStore } = useStore();

  return (
    <div className='flex space-x-1'>
      <button className='rounded bg-red-500 p-2 text-white' onClick={() => landingStore.stopProcessGroup(server.name, group.name)}>
        <RiStopFill />
      </button>
      <button className='rounded bg-blue-500 p-2 text-white' onClick={() => landingStore.restartProcessGroup(server.name, group.name)}>
        <TfiReload />
      </button>
    </div>
  );
};
