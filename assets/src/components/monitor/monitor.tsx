import { Server } from './server/server';
import { useEffect, useState } from 'react';

export const Monitor = ({ servers }: { servers: ApiSupervisor[] }): JSX.Element => {
  const [serversState, setServersState] = useState(servers);

  useEffect(() => {
    const interval = setInterval(() => {
      let serversTmp = servers;
      for (const item of serversTmp) {
        for (const group of item.groups) {
          for (const process of group.processes) {
            if (process.stateName === 'STOPPED' || process.stateName === 'EXITED' || process.stateName === 'FATAL') {
              continue;
            }

            process.now++;
          }
        }
      }

      setServersState(serversTmp);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='grid grid-cols-1 gap-2 px-2 py-1 xl:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4'>
      {serversState.map((item, index) => (
        <Server item={item} key={index} />
      ))}
    </div>
  );
};
