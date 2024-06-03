import { Running } from '~/components/monitor/server/parts/body/processes-list/program/buttons/running';
import { Inactive } from '~/components/monitor/server/parts/body/processes-list/program/buttons/inactive';

export const Buttons = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  const isAnyRunning = group.processes.some(process => process.stateName === 'RUNNING');

  return (isAnyRunning && <Running server={server} group={group} />) || <Inactive server={server} group={group} />;
};
