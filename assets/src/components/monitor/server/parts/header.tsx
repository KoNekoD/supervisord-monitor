import { Buttons } from '~/components/monitor/server/parts/header/buttons';
import { ServerInfo } from '~/components/monitor/server/parts/header/server-info';
import { ServerTitle } from '~/components/monitor/server/parts/header/server-title';
import { useOperationsSupervisors } from '~/shared/hooks/use-operations-supervisors';
import { useStore } from '~/main/context-provider';

export const Header = ({ item }: { item: ApiSupervisor }) => {
  const {landingStore} = useStore();
  const { restartAll, stopAll, startAll, clearAllProcessLog } = useOperationsSupervisors(landingStore);

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
