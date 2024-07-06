import { observer } from 'mobx-react-lite';
import { Monitor } from '~/components/monitor/monitor';
import { MonitorLoading } from '~/components/monitor/monitor-loading';
import { useGetSupervisors } from '~/api/use-get-supervisors';

export const MainPage = observer(() => {
  const { data: supervisors, isLoading } = useGetSupervisors();

  if (isLoading) {
    return <MonitorLoading />;
  }

  return <Monitor servers={supervisors!.data} />;
});
