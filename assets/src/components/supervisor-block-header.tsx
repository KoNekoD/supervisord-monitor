import { IoLockClosedSharp } from 'react-icons/io5';
import { TfiReload } from 'react-icons/tfi';
import { RiFileShredLine, RiPlayFill, RiStopFill } from 'react-icons/ri';
import { ActButton, Type } from './act-button';
import { AddProgram } from './add-program';
import { useStore } from '~/main/context-provider';
import { trimForProcessBlock } from '~/shared/lib/utils';

export const SupervisorBlockHeader = ({ item }: { item: ApiSupervisor }) => {
  const { landingStore } = useStore();

  const buttons = (
    <div className='flex justify-end'>
      <div className='flex items-center space-x-1'>
        <AddProgram />
        <ActButton type={Type.Orange} onClick={() => landingStore.clearAllProcessLog(item.server.name)}>
          <RiFileShredLine />
        </ActButton>
        <ActButton type={Type.Green} onClick={() => landingStore.startAll(item.server.name)}>
          <RiPlayFill />
        </ActButton>
        <ActButton type={Type.Red} onClick={() => landingStore.stopAll(item.server.name)}>
          <RiStopFill />
        </ActButton>
        <ActButton type={Type.Blue} onClick={() => landingStore.restartAll(item.server.name)}>
          <TfiReload />
        </ActButton>
      </div>
    </div>
  );

  const errMark = (
    <div className='flex items-center justify-center'>
      <span className='text-sm font-bold text-red-700'>error</span>
    </div>
  );

  let serverTitle = item.server.ip;
  let serverPort = ':' + item.server.port;
  let fullServerTitle = serverTitle + serverPort;

  return (
    <div className='lg:flex lg:justify-between'>
      <div className='flex flex-wrap items-center'>
        <a href={item.server.webOpenUrl} className='pr-2 text-blue-400'>
          {item.server.name}
        </a>
        <div className='flex flex-wrap items-center space-x-1'>
          <a title={fullServerTitle}>{trimForProcessBlock(serverTitle, serverPort)}</a>
          <span>{item.ok && item.server.authenticated && <IoLockClosedSharp color='green' />}</span>
          <span>{item.version}</span>
        </div>
      </div>
      {item.ok ? buttons : errMark}
    </div>
  );
};
