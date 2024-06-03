import { ProcessesList } from '~/components/monitor/server/parts/body/processes-list';
import { Fail } from '~/components/monitor/server/parts/body/fail';

export const Body = ({ item }: { item: ApiSupervisor }) => {
  return item.ok ? <ProcessesList groups={item.groups} server={item.server} /> : <Fail item={item} />;
};
