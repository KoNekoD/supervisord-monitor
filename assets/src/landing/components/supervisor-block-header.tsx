import { IoLockClosedSharp } from 'react-icons/io5';
import React from 'react';
import { useStore } from '../../main/context-provider';
import { TfiReload } from 'react-icons/tfi';
import { RiFileShredLine, RiPlayFill, RiStopFill } from 'react-icons/ri';
import { ActButton, Type } from './act-button';
import { AddProgram } from './add-program';

export const SupervisorBlockHeader = ({ item }: { item: ApiSupervisor }) => {
  const { landingStore } = useStore();

  const buttons = (
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
  );

  const errMark = (
    <span className='inline-block whitespace-nowrap rounded-[0.27rem] bg-danger-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-danger-700'>
      err
    </span>
  );

  return (
    <div className='lg:flex lg:justify-between'>
      <div className='flex flex-wrap items-center'>
        <a href={item.server.webOpenUrl} className='pr-2 text-blue-400'>
          {item.server.name}
        </a>
        <div className='flex flex-wrap items-center space-x-1'>
          <span>{item.server.ip + ':' + item.server.port}</span>
          <span>{item.ok && item.server.authenticated && <IoLockClosedSharp color='green' />}</span>
          <span>{item.version}</span>
        </div>
      </div>
      <div className='flex justify-end'>{item.ok ? buttons : errMark}</div>
    </div>
  );
};
