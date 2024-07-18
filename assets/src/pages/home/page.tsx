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
export let prevIsRefetching = false;

let prevDataEncoded = '';

export const MainPage = () => {
  const [serverTimeDiff, setServerTimeDiff] = useState(0);
  clearInterval(serverTimeDiffIntervalId);
  serverTimeDiffIntervalId = setInterval(() => setServerTimeDiff(serverTimeDiff + 1), 1000);
  const { data, isLoading, isRefetching, isFetched, isFetching, isPending, isSuccess, isFetchedAfterMount, isStale } = useGetSupervisors();

  console.log({"data": data, "isRefetching": isRefetching, "isFetched": isFetched, "isFetching": isFetching, "isPending": isPending, "isSuccess": isSuccess, "isFetchedAfterMount": isFetchedAfterMount, "isStale": isStale});

  const [readData, setReadData] = useState(data?.data);

  useEffect(() => {
    // if (isRefetching || isFetching) {
      // wait until data?.data change
      for (let i = 0; i < 10; i++) {
        const tmpData = JSON.stringify(data?.data);
        if (tmpData !== undefined && prevDataEncoded !== tmpData) {
          console.log('changed')
          console.log({ 'isRefetching': isRefetching, 'same': prevDataEncoded === JSON.stringify(data?.data) })
          setServerTimeDiff(0);
          prevDataEncoded = JSON.stringify(data?.data);
          setReadData(data?.data);
          break;
        }
        setTimeout(() => {}, 1000);
      }
    // }

    // console.log({ 'isRefetching': isRefetching, 'same': prevDataEncoded === nowDataEncoded })
    // if (prevDataEncoded !== nowDataEncoded) {
    //   setServerTimeDiff(0);
    //   prevDataEncoded = nowDataEncoded;
    // }
  }, [serverTimeDiff, prevDataEncoded, isRefetching, readData]);

  if (isLoading) {
    return <MonitorLoading />;
  }

  return <Monitor servers={readData ?? []} serverTimeDiff={serverTimeDiff} />;
};
