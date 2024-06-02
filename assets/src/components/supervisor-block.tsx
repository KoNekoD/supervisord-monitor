import { ProcessRow } from './process-row';
import { useState } from 'react';
import { SupervisorBlockHeader } from './supervisor-block-header';
import { FaChevronDown, FaChevronUp, FaSkull } from 'react-icons/fa';
import { ProcessGroupButtons } from './process-group-buttons';

const err_mark = function (reason: string) {
  return (
    <div className='h-full inline-flex w-full items-center bg-danger-100 dark:bg-transparent px-6 py-5 text-danger-700 dark:text-red-600'>
      <span className='mr-2'>
        <FaSkull />
      </span>
      <div className='flex flex-col'>
        <span>Server is not available!</span>
        <span>Reason: {reason}</span>
      </div>
    </div>
  );
};

interface AccordItemContentItem {
  content: JSX.Element;
  processes: ApiProcess[];
  server: ApiSupervisorServer;
}

interface AccordItem {
  heading: string;
  content: AccordItemContentItem;
}

const Accordion2 = ({ title, content }: { title: string; content: AccordItemContentItem }) => {
  const [isActive, setIsActive] = useState(false);

  const i = 4;
  const classStr = `w-${i} h-${i}`;

  let isAnyProcessRunning = content.processes.some(process => process.stateName === 'RUNNING');

  if (content.processes.length === 1) {
    return content.content;
  }

  return (
    <div className='accordion-item'>
      <div className='flex items-center space-x-2'>
        <div>
          <div
            className='transititext-secondary flex cursor-pointer items-center space-x-2 text-sm text-gray-500 transition duration-150 ease-in-out hover:text-secondary-600 focus:text-secondary-600 active:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-500 dark:focus:text-secondary-500 dark:active:text-secondary-600'
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <FaChevronUp className={classStr} /> : <FaChevronDown className={classStr} />}
            <div>
              <a>{title}</a>
            </div>
          </div>
        </div>
        <div className='flex flex-grow items-center justify-between'>
          {/* Костыль чтобы кнопки были на всю ширину */}
          &nbsp;
          <ProcessGroupButtons server={content.server.name} group={title} isAnyProcessRunning={isAnyProcessRunning} />
        </div>
      </div>
      {isActive && <div className='accordion-content'>{content.content}</div>}
    </div>
  );
};

export const SupervisorBlock = ({ item }: { item: ApiSupervisor }) => {
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
              return <ProcessRow process={process} server={item.server} key={index} />;
            })}
          </div>
        ),
        server: item.server,
        processes: value,
      },
    };
  });

  const processes = (
    <div>
      {groupItems.map((item: AccordItem, index: number) => (
        <div className={'border-b border-gray-200 px-2 py-1'} key={index}>
          <Accordion2 content={item.content} title={item.heading} />
        </div>
      ))}
    </div>
  );

  return (
    <div className='flex flex-col rounded-xl border-2 border-gray-200'>
      <div className='border-b border-gray-200 px-2 py-1'>
        <SupervisorBlockHeader item={item} />
      </div>
      {item.ok ? processes : err_mark(item.failError ?? 'Unknown error')}
    </div>
  );
};
