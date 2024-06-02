import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSkull } from 'react-icons/fa';
import { IoLockClosedSharp } from 'react-icons/io5';
import { ActButton, Type } from '~/components/act-button';
import { RiFileShredLine, RiPlayFill, RiStopFill } from 'react-icons/ri';
import { TfiReload } from 'react-icons/tfi';
import { useStore } from '~/main/context-provider';
import {GrErase} from "react-icons/gr";
import {GoDuplicate} from "react-icons/go";
import {ProcessLog, ProcessLogPurpose} from "~/components/process-log";

interface AccordItemContentItem {
  content: JSX.Element;
  processes: ApiProcess[];
  server: ApiSupervisorServer;
}

interface AccordItem {
  heading: string;
  content: AccordItemContentItem;
}

const trimForProcessBlock = (input: string, postfix: string = ''): string => {
  const DEFAULT_NAME_LEN =
    window.innerWidth < 640
      ? 35
      : window.innerWidth < 1280
        ? 55
        : window.innerWidth < 1536
          ? 50
          : window.innerWidth < 1920
            ? 15
            : 40;

  if (input.length <= DEFAULT_NAME_LEN) {
    return input;
  }

  const postfixLength = postfix ? postfix.length + 1 : 0;
  const truncatedLength = DEFAULT_NAME_LEN - postfixLength;

  return input.substring(0, truncatedLength) + '...' + (postfix ? postfix : '');
};

const Accordion2 = ({ title, content }: { title: string; content: AccordItemContentItem }) => {
  const [isActive, setIsActive] = useState(false);


  let isAnyProcessRunning = content.processes.some(process => process.stateName === 'RUNNING');

  if (content.processes.length === 1) {
    return content.content;
  }

  const { landingStore } = useStore();

  return (
    <div className='accordion-item'>
      <div className='flex items-center space-x-2'>
        <div>
          <div
            className='transititext-secondary flex cursor-pointer items-center space-x-2 text-sm text-gray-500 transition duration-150 ease-in-out hover:text-secondary-600 focus:text-secondary-600 active:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-500 dark:focus:text-secondary-500 dark:active:text-secondary-600'
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
            <div>
              <a>{title}</a>
            </div>
          </div>
        </div>
        <div className='flex flex-grow items-center justify-between'>
          {/* Костыль чтобы кнопки были на всю ширину */}
          &nbsp;
          <div>
            {(isAnyProcessRunning && (
              <div className='flex space-x-1'>
                <ActButton type={Type.Red} onClick={() => landingStore.stopProcessGroup(content.server.name, title)}>
                  <RiStopFill />
                </ActButton>
                <ActButton type={Type.Blue} onClick={() => landingStore.restartProcessGroup(content.server.name, title)}>
                  <TfiReload />
                </ActButton>
              </div>
            )) || (
              <div className='flex space-x-1'>
                <ActButton type={Type.Green} onClick={() => landingStore.startProcessGroup(content.server.name, title)}>
                  <RiPlayFill />
                </ActButton>
              </div>
            )}
          </div>
        </div>
      </div>
      {isActive && <div className='accordion-content'>{content.content}</div>}
    </div>
  );
};

export const SupervisorBlock = ({ item }: { item: ApiSupervisor }) => {
  const { landingStore } = useStore();
  // group processes by group key
  const groupMap = new Map<string, ApiProcess[]>();
  item.processes.forEach(process => {
    if (groupMap.has(process.group)) {
      groupMap.get(process.group)!.push(process);
    } else {
      groupMap.set(process.group, [process]);
    }
  });

  const groupItems: AccordItem[] = Array.from(groupMap.entries()).map(([key, value]) => {
    return {
      heading: key,
      content: {
        content: (
          <div>
            {value.map((process, index) => {
              return <div className='flex h-10 flex-row' key={index}>
                <div className='flex flex-grow items-center'>
                  <div className='px-2'>
                    <p>
                      <a
                        className='transititext-primary text-sm text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600'
                        data-te-toggle='tooltip'
                        title={process.name}
                      >
                        {trimForProcessBlock(process.name)}
                      </a>
                    </p>
                  </div>
                </div>
                <div className='flex flex-nowrap items-center space-x-2'>
                  {landingStore.isAllowMutatorsActive && (
                    <>
                      <ActButton onClick={() => landingStore.removeProcess(item.server, process)} type={Type.Red}>
                        <GrErase/>
                      </ActButton>
                      <ActButton onClick={() => landingStore.cloneProcess(item.server, process)} type={Type.Blue}>
                        <GoDuplicate/>
                      </ActButton>
                    </>
                  )}
                  {process.outLog && (
                    <ProcessLog log={process.outLog} server={item.server} process={process}
                                purpose={ProcessLogPurpose.StdOut}/>
                  )}
                  {process.errLog && (
                    <ProcessLog log={process.errLog} server={item.server} process={process}
                                purpose={ProcessLogPurpose.StdErr}/>
                  )}
                  <div className={'flex flex-col items-center'}>
                    {('RUNNING' === process.stateName && (
                        <span
                          className={
                            'inline-block whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-success-700'
                          }
                        >{process.stateName}</span>
                      )) ||
                      ('STARTING' === process.stateName && (
                        <span
                          className={
                            'inline-block whitespace-nowrap rounded-[0.27rem] bg-info-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-info-800'
                          }
                        >{process.stateName}</span>
                      )) ||
                      ('FATAL' === process.stateName && (
                        <span
                          className={
                            'inline-block whitespace-nowrap rounded-[0.27rem] bg-danger-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-danger-700'
                          }
                        >{process.stateName}</span>
                      )) ||
                      ('STOPPED' === process.stateName && (
                        <span
                          className={
                            'inline-block whitespace-nowrap rounded-[0.27rem] bg-neutral-800 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-neutral-50 dark:bg-neutral-900'
                          }
                        >{process.stateName}</span>
                      )) || (
                        <span
                          className={
                            'inline-block whitespace-nowrap rounded-[0.27rem] bg-warning-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-warning-800'
                          }
                        >{process.stateName}</span>
                      )}
                    <span>{process.descUptime}</span>
                  </div>
                  <div>
                    {process.stateName === 'RUNNING' && (
                      <div className='flex space-x-1'>
                        <ActButton type={Type.Red} onClick={() => landingStore.stopProcess(item.server, process)}>
                          <RiStopFill/>
                        </ActButton>
                        <ActButton type={Type.Blue} onClick={() => landingStore.restartProcess(item.server, process)}>
                          <TfiReload/>
                        </ActButton>
                      </div>
                    )}
                    {['STOPPED', 'EXITED', 'FATAL'].includes(process.stateName) && (
                      <div className='flex space-x-1'>
                        <ActButton type={Type.Green} onClick={() => landingStore.startProcess(item.server, process)}>
                          <RiPlayFill/>
                        </ActButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>;
            })}
          </div>
        ),
        server: item.server,
        processes: value,
      },
    };
  });

  const serverTitle = item.server.ip;
  const serverPort = `:${item.server.port}`;
  const fullServerTitle = `${serverTitle}${serverPort}`;

  return (
    <div className='flex flex-col rounded-xl border-2 border-gray-200'>
      <div className='border-b border-gray-200 px-2 py-1'>
        <div className='lg:flex lg:justify-between'>
          <div className='flex flex-wrap items-center'>
            <a href={item.server.webOpenUrl} className='pr-2 text-blue-400'>
              {item.server.name}
            </a>
            <div className='flex flex-wrap items-center space-x-1'>
              <a title={fullServerTitle}>{trimForProcessBlock(serverTitle, serverPort)}</a>
              <span>{item.ok && item.server.authenticated && <IoLockClosedSharp color='green'/>}</span>
              <span>{item.version}</span>
            </div>
          </div>
          {item.ok ? (
            <div className='flex justify-end'>
              <div className='flex items-center space-x-1'>
                <ActButton type={Type.Orange} onClick={() => landingStore.clearAllProcessLog(item.server.name)}>
                  <RiFileShredLine/>
                </ActButton>
                <ActButton type={Type.Green} onClick={() => landingStore.startAll(item.server.name)}>
                  <RiPlayFill/>
                </ActButton>
                <ActButton type={Type.Red} onClick={() => landingStore.stopAll(item.server.name)}>
                  <RiStopFill/>
                </ActButton>
                <ActButton type={Type.Blue} onClick={() => landingStore.restartAll(item.server.name)}>
                  <TfiReload/>
                </ActButton>
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
          {groupItems.map((item: AccordItem, index: number) => (
            <div className={'border-b border-gray-200 px-2 py-1'} key={index}>
              <Accordion2 content={item.content} title={item.heading}/>
            </div>
          ))}
        </div>
      ) : (
        <div
          className='inline-flex h-full w-full items-center bg-danger-100 px-6 py-5 text-danger-700 dark:bg-transparent dark:text-red-600'>
          <span className='mr-2'>
            <FaSkull/>
          </span>
          <div className='flex flex-col'>
            <span>Server is not available!</span>
            <span>Reason: {item.failError ?? 'Unknown error'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
