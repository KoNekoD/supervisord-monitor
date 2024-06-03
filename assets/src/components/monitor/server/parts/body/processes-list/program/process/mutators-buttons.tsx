import { useStore } from '~/main/context-provider';
import { GrErase } from 'react-icons/gr';
import { GoDuplicate } from 'react-icons/go';

export const MutatorsButtons = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  const { landingStore } = useStore();

  return (
    <div className='text-white space-x-1'>
      <button className='rounded bg-red-500 p-2' onClick={() => landingStore.removeProcess(server, process)}>
        <GrErase />
      </button>
      <button className='rounded bg-blue-500 p-2' onClick={() => landingStore.cloneProcess(server, process)}>
        <GoDuplicate />
      </button>
    </div>
  );
};
