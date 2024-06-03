import { Header } from '~/components/monitor/server/parts/header';
import { Body } from '~/components/monitor/server/parts/body';

export const Server = ({ item }: { item: ApiSupervisor }) => {
  return (
    <div className='flex flex-col rounded-xl border-2 border-gray-200'>
      <Header item={item} />
      <Body item={item} />
    </div>
  );
};
