import { Program } from '~/components/monitor/server/parts/body/processes-list/program';

export const ProcessesList = ({ groups, server }: { groups: ApiProcessGroup[]; server: ApiSupervisorServer }) => {
  return (
    <div className='rounded-b-xl border-l-2 border-r-2 border-b-2 border-gray-200'>
      {groups.map((value, index) => {
        const notLast = index !== groups.length - 1;

        return (
          <div className={notLast ? 'border-b border-gray-200' : ''}>
            <Program group={value} server={server} key={index} />
          </div>
        );
      })}
    </div>
  );
};
