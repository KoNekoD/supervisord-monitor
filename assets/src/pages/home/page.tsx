import { Monitor } from '~/components/monitor/monitor';
import { MonitorLoading } from '~/components/monitor/monitor-loading';
import { useGetSupervisors } from '~/api/use-get-supervisors';
import { useEffect, useState } from 'react';
import { data } from 'autoprefixer';

const useMountEffect = (fun) => useEffect(fun, []);

let serverTimeDiffIntervalId = 0;
class NeededReset {
  neededReset = false;
}
export let neededReset = new NeededReset();

export const MainPage = () => {
  const [serverTimeDiff, setServerTimeDiff] = useState(0);
  clearInterval(serverTimeDiffIntervalId);
  serverTimeDiffIntervalId = setInterval(() => setServerTimeDiff(serverTimeDiff + 1), 1000);
  const { data: supervisors, isLoading } = useGetSupervisors();

  useEffect(() => {
    if (neededReset.neededReset) {
      neededReset.neededReset = false;
      setServerTimeDiff(0);
    }
  }, [serverTimeDiff]);

  if (isLoading) {
    return <MonitorLoading />;
  }

  return <Monitor servers={supervisors!.data} serverTimeDiff={serverTimeDiff} />;
};
