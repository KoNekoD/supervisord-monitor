import { useEffect } from 'react';
import { useStore } from '~/main/context-provider';
import { observer } from 'mobx-react-lite';
import { Monitor } from '~/components/monitor/monitor';
import { MonitorLoading } from '~/components/monitor/monitor-loading';

export const MainPage = observer(() => {
  const { landingStore } = useStore();

  useEffect(() => {
    if (landingStore.actualData) {
      return;
    }

    landingStore.fetchData();
  });

  if (landingStore.actualData?.state !== 'fulfilled') {
    if (landingStore.prevData?.state === 'fulfilled') {
      return <Monitor blocks={landingStore.prevData?.value} />;
    }

    return <MonitorLoading />;
  }

  return <Monitor blocks={landingStore.actualData?.value} />;
});
