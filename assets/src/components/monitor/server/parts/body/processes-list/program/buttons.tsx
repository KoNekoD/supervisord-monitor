import { Running } from '~/components/monitor/server/parts/body/processes-list/program/buttons/running';
import { Inactive } from '~/components/monitor/server/parts/body/processes-list/program/buttons/inactive';
import { isHasRoleManager } from '~/app/providers/session/context';
import { Fragment } from 'react';

export const Buttons = ({ server, group }: { server: ApiSupervisorServer; group: ApiProcessGroup }) => {
  if (!isHasRoleManager()) {
    return <Fragment />;
  }

  const isAnyRunning = group.processes.some(process => process.stateName === 'RUNNING');

  return (isAnyRunning && <Running server={server} group={group} />) || <Inactive server={server} group={group} />;
};
