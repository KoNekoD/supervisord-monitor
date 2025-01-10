import { Header } from '~/components/monitor/server/parts/header';
import { Body } from '~/components/monitor/server/parts/body';

export const Monitor = ({ servers }: { servers: ApiSupervisor[] }) => {
  return (
    <div className='grid grid-cols-1 gap-2 px-2 py-1 xl:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4'>
      {servers.map((item, index) => (
        <div className='flex flex-col' key={index}>
          <Header item={item} />
          <Body item={item} />
        </div>
      ))}
    </div>
  );
};
