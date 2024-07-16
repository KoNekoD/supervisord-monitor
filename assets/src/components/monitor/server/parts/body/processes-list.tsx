import { Program } from '~/components/monitor/server/parts/body/processes-list/program';

export const ProcessesList = ({ groups, server, serverTimeDiff }: { groups: ApiProcessGroup[]; server: ApiSupervisorServer, serverTimeDiff: number }) => {
  return (
    <div className='rounded-b-xl border-b-2 border-l-2 border-r-2 border-gray-200'>
      {groups.map((value, index) => {
        const notLast = index !== groups.length - 1;

        return (
          <div className={notLast ? 'border-b border-gray-200' : ''} key={index}>
            <Program group={value} server={server}  serverTimeDiff={serverTimeDiff}/>
          </div>
        );
      })}
    </div>
  );
};
