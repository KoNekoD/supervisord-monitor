import { RiFileShredLine, RiPlayFill, RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { useStore } from '~/main/context-provider';
import { isHasRoleManager } from '~/app/providers/session/context';
import { Fragment } from 'react';

export const Buttons = ({ serverName }: { serverName: string }) => {
  const { landingStore } = useStore();

  if (!isHasRoleManager()) {
    return <Fragment />;
  }

  return (
    <div className='flex justify-end'>
      <div className='flex items-center space-x-1 text-white'>
        <button className='rounded bg-orange-500 p-2' onClick={() => landingStore.clearAllProcessLog(serverName)}>
          <RiFileShredLine />
        </button>
        <button className='rounded bg-green-500 p-2' onClick={() => landingStore.startAll(serverName)}>
          <RiPlayFill />
        </button>
        <button className='rounded bg-red-500 p-2' onClick={() => landingStore.stopAll(serverName)}>
          <RiStopFill />
        </button>
        <button className='rounded bg-blue-500 p-2' onClick={() => landingStore.restartAll(serverName)}>
          <TfiReload />
        </button>
      </div>
    </div>
  );
};
