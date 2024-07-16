import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Process } from '~/components/monitor/server/parts/body/processes-list/program/process';
import { Buttons } from '~/components/monitor/server/parts/body/processes-list/program/buttons';

function isNumeric(n: any) {
  return !isNaN(n);
}

export const Program = ({ group, server, serverTimeDiff }: { group: ApiProcessGroup; server: ApiSupervisorServer, serverTimeDiff: number }) => {
  const list = group.processes;
  const items = list.map((p, i) => <Process process={p} server={server} serverTimeDiff={serverTimeDiff} key={i} />);

  if (group.processes.length === 1 && !isNumeric(group.processes[0].name)) {
    return <div className='px-2 py-1'>{items}</div>;
  }

  const [isActive, setIsActive] = useState(false);

  return (
    <div className='px-2 py-1'>
      <div className='flex items-center space-x-2'>
        <div>
          <div
            className='program-title flex cursor-pointer items-center space-x-2'
            onClick={() => setIsActive(!isActive)}
          >
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
