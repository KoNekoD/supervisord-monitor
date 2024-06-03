import { trim } from '~/components/monitor/server/util/trim';
import { IoLockClosedSharp } from 'react-icons/io5';
import { Fail } from '~/components/monitor/server/parts/header/server-info/fail';

export const ServerInfo = ({ item }: { item: ApiSupervisor }) => {
  if (!item.ok) {
    return <Fail />;
  }

  const serverTitle = item.server.ip;
  const serverPort = `:${item.server.port}`;
  const serverFullTitle = `${serverTitle}${serverPort}`;

  return (
    <div className='flex flex-wrap items-center space-x-1'>
      <a title={serverFullTitle}>{trim(serverTitle, serverPort)}</a>
      <span>{item.server.authenticated && <IoLockClosedSharp color='green' />}</span>
      <span>{item.version}</span>
    </div>
  );
};
