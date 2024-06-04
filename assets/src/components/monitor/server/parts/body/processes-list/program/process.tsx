import { ProcessLog } from '~/components/monitor/server/parts/body/processes-list/program/process-log';
import { useStore } from '~/main/context-provider';
import { Status } from '~/components/monitor/server/parts/body/processes-list/program/process/status';
import { Buttons } from '~/components/monitor/server/parts/body/processes-list/program/process/buttons';
import { MutatorsButtons } from '~/components/monitor/server/parts/body/processes-list/program/process/mutators-buttons';

export const Process = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {
  const { landingStore } = useStore();

  return (
    <div className='flex h-10 flex-row'>
      <div className='no-scrollbar mx-1 flex flex-grow items-center overflow-x-auto px-1'>
        <a className='whitespace-nowrap text-sm text-primary hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600' data-te-toggle='tooltip' title={process.name}>
          {process.name}
        </a>
      </div>
      <div className='flex flex-nowrap items-center space-x-1'>
        {landingStore.isAllowMutatorsActive && <MutatorsButtons server={server} process={process} />}
        <ProcessLog process={process} server={server} />
        <div className={'flex flex-col items-center'}>
          <Status stateName={process.stateName} />
          <span>{process.descUptime}</span>
        </div>
        <div>
          <Buttons process={process} server={server} />
        </div>
      </div>
    </div>
  );
};
