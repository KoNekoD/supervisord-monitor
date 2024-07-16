import { ProcessesList } from '~/components/monitor/server/parts/body/processes-list';
import { Fail } from '~/components/monitor/server/parts/body/fail';

export const Body = ({ item, serverTimeDiff }: { item: ApiSupervisor, serverTimeDiff: number }) => {
  return item.ok ? <ProcessesList groups={item.groups} server={item.server}  serverTimeDiff={serverTimeDiff}/> : <Fail item={item} />;
};
