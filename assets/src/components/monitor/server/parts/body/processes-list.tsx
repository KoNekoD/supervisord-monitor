import { Program } from '~/components/monitor/server/parts/body/processes-list/program';

export const ProcessesList = ({ groups, server }: { groups: ApiProcessGroup[]; server: ApiSupervisorServer }) => {
  return groups.map((value, index) => <Program group={value} server={server} key={index} />);
};
