import { RiBookletFill, RiCloseFill } from 'react-icons/ri';
import React from 'react';
import { useStore } from '~/main/context-provider';
import { IoIosWarning } from 'react-icons/io';

export const ProcessLog = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  const { landingStore } = useStore();
  const [showModal, setShowModal] = React.useState(false);
  const [log, setLog] = React.useState<ApiProcessLog | null>(null);
  const activateLog = (log: ApiProcessLog | null) => {
    setLog(log);
    setShowModal(true);
  };

  return (
    <div>
      <div className='space-x-1'>
        {process.outLog && (
          <button className='rounded bg-gray-500 px-2 py-2 font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600' type='button' onClick={() => activateLog(process.outLog)}>
            <RiBookletFill />
          </button>
        )}
        {process.errLog && (
          <button className='rounded bg-red-500 px-2 py-2 font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600' type='button' onClick={() => activateLog(process.errLog)}>
            <IoIosWarning />
          </button>
        )}
      </div>
      {showModal && log && (
        <div className='fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none'>
          <div className='pointer-events-none relative h-full w-full'>
            <div className='pointer-events-auto relative flex max-h-[100%-1rem] w-full flex-col rounded-md border-none bg-clip-padding text-current shadow-lg outline-none'>
              <div className='m-8 max-h-[100%-1rem] bg-white dark:bg-gray-600'>
                <div className='flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-gray-100 border-opacity-100 p-4 dark:border-opacity-50'>
                  <h5 className='text-xl font-medium leading-normal text-gray-800 dark:text-gray-200'>Log</h5>
                  <button type='button' className='box-content h-10 rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none' onClick={() => setShowModal(false)}>
                    <RiCloseFill />
                  </button>
                </div>
                <div className='relative overflow-y-auto p-4'>
                  {log.log.split('\n').map((item, index) => (
                    <p className='whitespace-nowrap' key={index}>{item}</p>
                  ))}
                </div>
                <div className='flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-gray-100 border-opacity-100 p-4 dark:border-opacity-50'>
                  <button type='button' onClick={() => setShowModal(false)} className='background-transparent px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none'>
                    Close
                  </button>
                  <button
                    type='button'
                    className='rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600'
                    onClick={() => {
                      landingStore.clearProcessLog(server, process);
                      setShowModal(false);
                    }}
                  >
                    Clear logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
