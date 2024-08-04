import { Monitor } from '~/components/monitor/monitor';
import { MonitorLoading } from '~/components/monitor/monitor-loading';
import { useGetSupervisors } from '~/api/use-get-supervisors';
import { useEffect, useState } from 'react';

let serverTimeDiffIntervalId = 0;
let prevDataEncoded = '';

export const MainPage = () => {
  const [serverTimeDiff, setServerTimeDiff] = useState(0);
  clearInterval(serverTimeDiffIntervalId);
  serverTimeDiffIntervalId = setInterval(() => setServerTimeDiff(serverTimeDiff + 1), 1000);
  const { data, isLoading, isRefetching } = useGetSupervisors();

  const [readData, setReadData] = useState(data?.data);

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      let tmpData = JSON.stringify(data?.data);
      if (tmpData !== undefined && prevDataEncoded !== tmpData) {
        setServerTimeDiff(0);
        prevDataEncoded = tmpData;
        setReadData(data?.data);
        break;
      }
      setTimeout(() => {}, 1000);
    }
  }, [serverTimeDiff, prevDataEncoded, isRefetching, readData]);

  if (isLoading) {
    return <MonitorLoading />;
  }

  return <Monitor servers={readData ?? []} serverTimeDiff={serverTimeDiff} />;
};
