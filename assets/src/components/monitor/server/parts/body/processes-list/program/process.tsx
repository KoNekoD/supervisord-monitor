import { ProcessLog } from '~/components/monitor/server/parts/body/processes-list/program/process-log';
import { useStore } from '~/main/context-provider';
import { Status } from '~/components/monitor/server/parts/body/processes-list/program/process/status';
import { Buttons } from '~/components/monitor/server/parts/body/processes-list/program/process/buttons';
import { MutatorsButtons } from '~/components/monitor/server/parts/body/processes-list/program/process/mutators-buttons';
import { Uptime } from '~/components/monitor/server/parts/body/processes-list/program/process/uptime';

export const Process = ({ process, server, serverTimeDiff }: { process: ApiProcess; server: ApiSupervisorServer, serverTimeDiff: number }) => {
  const { landingStore } = useStore();

  return (
    <div className='flex h-10 flex-row'>
      <div className='no-scrollbar mx-1 flex flex-grow items-center overflow-x-auto px-1'>
        <a className='program-title whitespace-nowrap' title={process.name}>
          {process.name}
        </a>
      </div>
      <div className='flex flex-nowrap items-center space-x-1'>
        {landingStore.allowMutators && <MutatorsButtons server={server} process={process} />}
        <ProcessLog process={process} server={server} />
        <div className={'flex flex-col items-center'}>
          <Status stateName={process.stateName} />
          <Uptime process={process}  serverTimeDiff={serverTimeDiff}/>
        </div>
        <div>
          <Buttons process={process} server={server} />
        </div>
      </div>
    </div>
  );
};
