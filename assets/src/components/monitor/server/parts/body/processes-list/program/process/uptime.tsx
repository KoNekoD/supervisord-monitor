import { useEffect, useState } from 'react';

export const Uptime = ({ process }: { process: ApiProcess }) => {
  const [nowTime, setNowTime] = useState(new Date(process.now * 1000));

  // I think it's a crutch, but without it, the component's state doesn't change
  // See also assets/src/components/monitor/monitor.tsx:7
  useEffect(() => {
    if (process.stateName === 'STOPPED' || process.stateName === 'EXITED' || process.stateName === 'FATAL') {
      return () => {
      };
    }
    const interval = setInterval(() => {
      const newNowTime = new Date(process.now * 1000);
      if (newNowTime.getTime() === nowTime.getTime()) {
        return;
      }
      setNowTime(newNowTime);
    }, 1);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * STOPPED, EXITED, FATAL - Stop time
   * RUNNING - Start time
   * STARTING, STOPPING, BACKOFF, UNKNOWN - Do not show
   */
  if (!['STOPPED', 'EXITED', 'FATAL', 'RUNNING'].includes(process.stateName)) {
    return <></>;
  }

  const start = new Date(process.start * 1000);
  const stop = new Date(process.stop * 1000);

  let duration = 0;
  let timeClass = '';

  if (process.stateName === 'STOPPED' || process.stateName === 'EXITED' || process.stateName === 'FATAL') {
    timeClass = 'text-gray-400';
    duration = (stop - start) / 1000;
  } else if (process.stateName === 'RUNNING') {
    duration = (nowTime - start) / 1000;
  }

  const years = Math.floor(duration / (60 * 60 * 24 * 365));
  const days = Math.floor(duration / (60 * 60 * 24)) % 365;
  const hours = Math.floor(duration / (60 * 60)) % 24;
  const minutes = Math.floor(duration / 60) % 60;
  const seconds = Math.floor(duration) % 60;

  const yearsString = years.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  const daysString = days.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  const hoursString = hours.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  const minutesString = minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
  const secondsString = seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

  const yearsEl = <span className="text-gray-600">{yearsString}</span>;
  const daysEl = <span className="text-gray-500">{daysString}</span>;
  const hoursEl = <span>{hoursString}</span>;
  const minutesEl = <span>{minutesString}</span>;
  const secondsEl = <span>{secondsString}</span>;

  const timeEl = <span className={timeClass}>{hoursEl}:{minutesEl}:{secondsEl}</span>;

  if (years > 0) {
    return <span>{yearsEl}:{daysEl}:{timeEl}</span>;
  }

  if (days > 0) {
    return <span>{daysEl}:{timeEl}</span>;
  }

  return <span>{timeEl}</span>;
};
