import { IoLockClosedSharp } from 'react-icons/io5';
import { trim } from '~/components/monitor/server/util/trim';
import { Buttons } from '~/components/monitor/server/parts/header/buttons';
import { Fail } from '~/components/monitor/server/parts/header/fail';

export const Header = ({ item }: { item: ApiSupervisor }) => {
  const serverTitle = item.server.ip;
  const serverPort = `:${item.server.port}`;
  const serverFullTitle = `${serverTitle}${serverPort}`;

  const serverName = item.server.name;

  return (
    <div className='border-b border-gray-200 px-2 py-1 rounded-t-xl border-l-2 border-r-2 border-t-2'>
      <div className='lg:flex lg:justify-between'>
        <div className='flex flex-wrap items-center'>
          <a href={item.server.webOpenUrl} className='pr-2 text-blue-400'>
            {item.server.name}
          </a>
          <div className='flex flex-wrap items-center space-x-1'>
            <a title={serverFullTitle}>{trim(serverTitle, serverPort)}</a>
            <span>{item.ok && item.server.authenticated && <IoLockClosedSharp color='green' />}</span>
            <span>{item.version}</span>
          </div>
        </div>
        {item.ok ? <Buttons serverName={serverName} /> : <Fail />}
      </div>
    </div>
  );
};
