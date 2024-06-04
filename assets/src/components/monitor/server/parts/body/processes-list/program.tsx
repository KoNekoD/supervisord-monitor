import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Process } from '~/components/monitor/server/parts/body/processes-list/program/process';
import { Buttons } from '~/components/monitor/server/parts/body/processes-list/program/buttons';

export const Program = ({ group, server }: { group: ApiProcessGroup; server: ApiSupervisorServer }) => {
  const list = group.processes;
  const items = list.map((p, i) => <Process process={p} server={server} key={i} />);

  if (group.processes.length === 1) {
    return <div className='px-2 py-1'>{items}</div>;
  }

  const [isActive, setIsActive] = useState(false);

  return (
    <div className='px-2 py-1'>
      <div className='flex items-center space-x-2'>
        <div>
          <div className='flex cursor-pointer items-center space-x-2 program-title' onClick={() => setIsActive(!isActive)}>
            {isActive ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='h-4 w-4' />}
            <div>
              <a>{group.name}</a>
            </div>
          </div>
        </div>
        <div className='flex flex-grow items-center justify-between'>
          {/* Костыль чтобы кнопки были на всю ширину */} &nbsp;
          <div>
            <Buttons server={server} group={group} />
          </div>
        </div>
      </div>
      {isActive && items}
    </div>
  );
};
