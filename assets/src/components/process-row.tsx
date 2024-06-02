import {ProcessLog, ProcessLogPurpose} from './process-log';
import {ActButton, Type} from './act-button';
import {GoDuplicate} from 'react-icons/go';
import {GrErase} from 'react-icons/gr';
import {ProcessButtons} from './process-buttons';
import {useStore} from '~/main/context-provider';
import {trimForProcessBlock} from "~/shared/lib/utils";

function Status({ stateName }: { stateName: string }) {
  const success_badge =
    'inline-block whitespace-nowrap rounded-[0.27rem] bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-success-700';

  const info_badge =
    'inline-block whitespace-nowrap rounded-[0.27rem] bg-info-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-info-800';

  const danger_badge =
    'inline-block whitespace-nowrap rounded-[0.27rem] bg-danger-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-danger-700';

  const dark_badge =
    'inline-block whitespace-nowrap rounded-[0.27rem] bg-neutral-800 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-neutral-50 dark:bg-neutral-900';

  const warning_badge =
    'inline-block whitespace-nowrap rounded-[0.27rem] bg-warning-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-warning-800';

  if (stateName === 'RUNNING') {
    return <span className={success_badge}>{stateName}</span>;
  } else if (stateName === 'STARTING') {
    return <span className={info_badge}>{stateName}</span>;
  } else if (stateName === 'FATAL') {
    return <span className={danger_badge}>{stateName}</span>;
  } else if (stateName === 'STOPPED') {
    return <span className={dark_badge}>{stateName}</span>;
  } else {
    return <span className={warning_badge}>{stateName}</span>;
  }
}

export const ProcessRow = ({ process, server }: { process: ApiProcess; server: ApiSupervisorServer }) => {

  const { landingStore } = useStore();

  return (
    <div className='flex h-10 flex-row'>
      <div className='flex flex-grow items-center'>
        <div className='px-2'>
          <p>
            <a
              className='transititext-primary text-sm text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600'
              data-te-toggle='tooltip'
              title={process.name}
            >
              {trimForProcessBlock(process.name)}
            </a>
          </p>
        </div>
      </div>
      <div className='flex flex-nowrap items-center space-x-2'>
        {landingStore.isAllowMutatorsActive && (
          <>
            <ActButton onClick={() => landingStore.removeProcess(server, process)} type={Type.Red}>
              <GrErase />
            </ActButton>
            <ActButton onClick={() => landingStore.cloneProcess(server, process)} type={Type.Blue}>
              <GoDuplicate />
            </ActButton>
          </>
        )}
        {process.outLog && (
          <ProcessLog log={process.outLog} server={server} process={process} purpose={ProcessLogPurpose.StdOut} />
        )}
        {process.errLog && (
          <ProcessLog log={process.errLog} server={server} process={process} purpose={ProcessLogPurpose.StdErr} />
        )}
        <div className={'flex flex-col items-center'}>
          <Status stateName={process.stateName} />
          <span>{process.descUptime}</span>
        </div>
        <ProcessButtons process={process} server={server} />
      </div>
    </div>
  );
};
