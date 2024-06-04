import { trim } from '~/components/monitor/server/util/trim';
import { IoLockClosedSharp } from 'react-icons/io5';
import { Fail } from '~/components/monitor/server/parts/header/server-info/fail';

export const ServerInfo = ({ item }: { item: ApiSupervisor }) => {
  if (!item.ok) {
    return <Fail />;
  }

  const ip = item.server.ip;
  const port = item.server.port;
  const full = `${ip}:${port}`;

  return (
    <div className='flex flex-wrap items-center space-x-1'>
      <a title={full}>{trim(ip, `:${port}`)}</a>
      <span>{item.server.authenticated && <IoLockClosedSharp color='green' />}</span>
      <span>{item.version}</span>
    </div>
  );
};
