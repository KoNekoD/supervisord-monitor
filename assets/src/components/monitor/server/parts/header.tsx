import { Buttons } from '~/components/monitor/server/parts/header/buttons';
import { ServerInfo } from '~/components/monitor/server/parts/header/server-info';
import { ServerTitle } from '~/components/monitor/server/parts/header/server-title';

export const Header = ({ item }: { item: ApiSupervisor }) => {
  return (
    <div className='rounded-t-xl border-b border-l-2 border-r-2 border-t-2 border-gray-200 px-2 py-1'>
      <div className='space-x-2 lg:flex lg:justify-between'>
        <div className='flex w-full flex-wrap items-center justify-between'>
          <ServerTitle item={item} />
          <ServerInfo item={item} />
        </div>
        {item.ok && <Buttons serverName={item.server.name} />}
      </div>
    </div>
  );
};
