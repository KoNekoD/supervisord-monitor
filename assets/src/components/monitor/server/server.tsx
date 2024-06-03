import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSkull } from 'react-icons/fa';
import { IoLockClosedSharp } from 'react-icons/io5';
import { RiBookletFill, RiCloseFill, RiFileShredLine, RiPlayFill, RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { useStore } from '~/main/context-provider';
import { GrErase } from 'react-icons/gr';
import { GoDuplicate } from 'react-icons/go';
import { IoIosWarning } from 'react-icons/io';

const trimForProcessBlock = (input: string, postfix: string = ''): string => {
  const DEFAULT_NAME_LEN = window.innerWidth < 640 ? 35 : window.innerWidth < 1280 ? 55 : window.innerWidth < 1536 ? 50 : window.innerWidth < 1920 ? 15 : 40;

  if (input.length <= DEFAULT_NAME_LEN) {
    return input;
  }

  const postfixLength = postfix ? postfix.length + 1 : 0;
  const truncatedLength = DEFAULT_NAME_LEN - postfixLength;

  return input.substring(0, truncatedLength) + '...' + (postfix ? postfix : '');
};

export const Server = ({ item }: { item: ApiSupervisor }) => {
  const { landingStore } = useStore();
  const serverTitle = item.server.ip;
  const serverPort = `:${item.server.port}`;
  const fullServerTitle = `${serverTitle}${serverPort}`;

  const [showModal, setShowModal] = React.useState(false);
  const [log, setLog] = React.useState<ApiProcessLog>({ log: '' });
  const [logProcess, setLogProcess] = React.useState<ApiProcess | null>(null);
  const activateLog = (process: ApiProcess, log: ApiProcessLog) => {
    setLogProcess(process);
    setLog(log);
    setShowModal(true);
  };

  return (
    <div>
      {showModal && (
        <div className='fixed left-0 top-0 z-[1055] mx-8 my-4 h-full w-full overflow-y-auto overflow-x-hidden p-10 outline-none'>
          <div className='pointer-events-none relative h-[calc(100%-1rem)] w-full'>
            <div className='pointer-events-auto relative flex max-h-[100%] w-full flex-col overflow-hidden rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600'>
              <div className='flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50'>
                <h5 className='text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200'>Log</h5>
                <button type='button' className='box-content h-10 rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none' onClick={() => setShowModal(false)}>
                  <RiCloseFill />
                </button>
              </div>

              <div className='relative overflow-y-auto p-4'>
                {log.log.split('\n').map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>

              <div className='flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50'>
                <button type='button' onClick={() => setShowModal(false)} className='background-transparent px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none'>
                  Close
                </button>
                <button
                  type='button'
                  className='rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600'
                  onClick={() => {
                    landingStore.clearProcessLog(item.server, logProcess as ApiProcess);
                    setShowModal(false);
                  }}
                >
                  Clear logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='flex flex-col rounded-xl border-2 border-gray-200'>
        <div className='border-b border-gray-200 px-2 py-1'>
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
            {item.ok ? (
              <div className='flex justify-end'>
                <div className='flex items-center space-x-1'>
                  <button className='rounded bg-orange-500 p-2 text-white' onClick={() => landingStore.clearAllProcessLog(item.server.name)}>
                    <RiFileShredLine />
                  </button>
                  <button className='rounded bg-green-500 p-2 text-white' onClick={() => landingStore.startAll(item.server.name)}>
                    <RiPlayFill />
                  </button>
                  <button className='rounded bg-red-500 p-2 text-white' onClick={() => landingStore.stopAll(item.server.name)}>
                    <RiStopFill />
                  </button>
                  <button className='rounded bg-blue-500 p-2 text-white' onClick={() => landingStore.restartAll(item.server.name)}>
                    <TfiReload />
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <span className='text-sm font-bold text-red-700'>error</span>
              </div>
            )}
          </div>
        </div>
        {item.ok ? (
          <div>
            {item.groups.map((value, index) => {
              const content = (
                <div>
                  {value.processes.map((process, index) => {
                    return (
                      <div className='flex h-10 flex-row' key={index}>
                        <div className='flex flex-grow items-center'>
                          <div className='px-2'>
                            <p>
                              <a className='transititext-primary text-sm text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600' data-te-toggle='tooltip' title={process.name}>
                                {trimForProcessBlock(process.name)}
                              </a>
                            </p>
                          </div>
                        </div>
                        <div className='flex flex-nowrap items-center space-x-2'>
                          {landingStore.isAllowMutatorsActive && (
                            <>
                              <button className='rounded bg-red-500 p-2 text-white' onClick={() => landingStore.removeProcess(item.server, process)}>
                                <GrErase />
                              </button>
                              <button className='rounded bg-blue-500 p-2 text-white' onClick={() => landingStore.cloneProcess(item.server, process)}>
                                <GoDuplicate />
                              </button>
                            </>
                          )}
                          {process.outLog && (
                            <button className='rounded bg-gray-500 px-2 py-2 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600' type='button' onClick={() => activateLog(process, process.outLog as ApiProcessLog)}>
                              <RiBookletFill />
                            </button>
                          )}
                          {process.errLog && (
                            <button className='rounded bg-red-500 px-2 py-2 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600' type='button' onClick={() => activateLog(process, process.errLog as ApiProcessLog)}>
                              <IoIosWarning />
                            </button>
                          )}
                          <div className={'flex flex-col items-center'}>
                            {('RUNNING' === process.stateName && <span className={'inline-block whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-success-700'}>{process.stateName}</span>) || ('STARTING' === process.stateName && <span className={'inline-block whitespace-nowrap rounded-[0.27rem] bg-info-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-info-800'}>{process.stateName}</span>) || ('FATAL' === process.stateName && <span className={'inline-block whitespace-nowrap rounded-[0.27rem] bg-danger-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-danger-700'}>{process.stateName}</span>) || ('STOPPED' === process.stateName && <span className={'inline-block whitespace-nowrap rounded-[0.27rem] bg-neutral-800 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-neutral-50 dark:bg-neutral-900'}>{process.stateName}</span>) || (
                              <span className={'inline-block whitespace-nowrap rounded-[0.27rem] bg-warning-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-warning-800'}>{process.stateName}</span>
                            )}
                            <span>{process.descUptime}</span>
                          </div>
                          <div>
                            {process.stateName === 'RUNNING' && (
                              <div className='flex space-x-1'>
                                <button className='rounded bg-red-500 p-2 text-white' onClick={() => landingStore.stopProcess(item.server, process)}>
                                  <RiStopFill />
                                </button>
                                <button className='rounded bg-blue-500 p-2 text-white' onClick={() => landingStore.restartProcess(item.server, process)}>
                                  <TfiReload />
                                </button>
                              </div>
                            )}
                            {['STOPPED', 'EXITED', 'FATAL'].includes(process.stateName) && (
                              <div className='flex space-x-1'>
                                <button className='rounded bg-green-500 p-2 text-white' onClick={() => landingStore.startProcess(item.server, process)}>
                                  <RiPlayFill />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );

              if (value.processes.length === 1) {
                return (
                  <div className='border-b border-gray-200 px-2 py-1' key={index}>
                    {content}
                  </div>
                );
              }

              const [isActive, setIsActive] = useState(false);

              let isAnyProcessRunning = value.processes.some(process => process.stateName === 'RUNNING');

              return (
                <div className='border-b border-gray-200 px-2 py-1' key={index}>
                <div className='accordion-item'>
                  <div className='flex items-center space-x-2'>
                    <div>
                      <div className='transititext-secondary flex cursor-pointer items-center space-x-2 text-sm text-gray-500 transition duration-150 ease-in-out hover:text-secondary-600 focus:text-secondary-600 active:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-500 dark:focus:text-secondary-500 dark:active:text-secondary-600' onClick={() => setIsActive(!isActive)}>
                        {isActive ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='h-4 w-4' />}
                        <div>
                          <a>{value.name}</a>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-grow items-center justify-between'>
                      {/* Костыль чтобы кнопки были на всю ширину */}
                      &nbsp;
                      <div>
                        {(isAnyProcessRunning && (
                          <div className='flex space-x-1'>
                            <button className='rounded bg-red-500 p-2 text-white' onClick={() => landingStore.stopProcessGroup(item.server.name, value.name)}>
                              <RiStopFill />
                            </button>
                            <button className='rounded bg-blue-500 p-2 text-white' onClick={() => landingStore.restartProcessGroup(item.server.name, value.name)}>
                              <TfiReload />
                            </button>
                          </div>
                        )) || (
                          <div className='flex space-x-1'>
                            <button className='rounded bg-green-500 p-2 text-white' onClick={() => landingStore.startProcessGroup(item.server.name, value.name)}>
                              <RiPlayFill />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isActive && <div className='accordion-content'>{content}</div>}
                </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='inline-flex h-full w-full items-center bg-danger-100 px-6 py-5 text-danger-700 dark:bg-transparent dark:text-red-600'>
            <span className='mr-2'>
              <FaSkull />
            </span>
            <div className='flex flex-col'>
              <span>Server is not available!</span>
              <span>Reason: {item.failError ?? 'Unknown error'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
