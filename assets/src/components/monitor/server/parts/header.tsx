import { Buttons } from '~/components/monitor/server/parts/header/buttons';
import { ServerInfo } from '~/components/monitor/server/parts/header/server-info';
import { ServerTitle } from '~/components/monitor/server/parts/header/server-title';
import { checkValidResultSuccess } from '~/shared/lib/checkValidResultSuccess';
import toast from 'react-hot-toast';
import { notifyError } from '~/shared/lib/notifyError';
import { useManageSupervisors } from '~/api/use-manage-supervisors';
import { useInvalidateSupervisors } from '~/api/use-get-supervisors';

export const Header = ({ item }: { item: ApiSupervisor }) => {
  const manageSupervisors = useManageSupervisors();
  const invalidateSupervisors = useInvalidateSupervisors();

  const clearAllProcessLog = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'clear_all_process_log',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All process logs cleared on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const startAll = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'start_all_processes',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All processes started on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const stopAll = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'stop_all_processes',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All processes stopped on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  const restartAll = (serverName: string) =>
    manageSupervisors
      .mutateAsync({
        server: serverName,
        type: 'restart_all_processes',
        group: null,
        process: null,
      })
      .then(result => {
        if (checkValidResultSuccess(result)) {
          toast.success(`All processes restarted on server ${serverName}`);
        }
        invalidateSupervisors();
      })
      .catch(err => notifyError(err));

  return (
    <div className='rounded-t-xl border-b border-l-2 border-r-2 border-t-2 border-gray-200 px-2 py-1'>
      <div className='space-x-2 lg:flex lg:justify-between'>
        <div className='flex w-full flex-wrap items-center justify-between'>
          <ServerTitle item={item} />
          <ServerInfo item={item} />
        </div>
        {item.ok && (
          <Buttons
            stopAll={stopAll.bind(null, item.server.name)}
            restartAll={restartAll.bind(null, item.server.name)}
            startAll={startAll.bind(null, item.server.name)}
            clearAllProcessLog={clearAllProcessLog.bind(null, item.server.name)}
          />
        )}
      </div>
    </div>
  );
};
