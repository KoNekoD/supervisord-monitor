export const Uptime = ({ process, serverTimeDiff }: { process: ApiProcess; serverTimeDiff: number }) => {
  /**
   * STOPPED, EXITED, FATAL - Stop time
   * RUNNING - Start time
   * STARTING, STOPPING, BACKOFF, UNKNOWN - Do not show
   */
  if (!['STOPPED', 'EXITED', 'FATAL', 'RUNNING'].includes(process.stateName)) {
    return <></>;
  }

  const start = process.start;
  const stop = process.stop;
  const now = process.now + serverTimeDiff;

  let duration = 0;
  let timeClass = '';

  if (process.stateName === 'STOPPED' || process.stateName === 'EXITED' || process.stateName === 'FATAL') {
    // In case the program tried to start but did not stop because it failed to start
    // for example, it didn't find an executable file
    if (start > 0 && stop === 0) {
      return <></>;
    }

    timeClass = 'text-gray-400';
    duration = stop - start;
  } else if (process.stateName === 'RUNNING') {
    duration = now - start;
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

  const yearsEl = <span className='text-gray-600'>{yearsString}</span>;
  const daysEl = <span className='text-gray-500'>{daysString}</span>;
  const hoursEl = <span>{hoursString}</span>;
  const minutesEl = <span>{minutesString}</span>;
  const secondsEl = <span>{secondsString}</span>;

  const timeEl = (
    <span className={timeClass}>
      {hoursEl}:{minutesEl}:{secondsEl}
    </span>
  );

  if (years > 0) {
    return (
      <span>
        {yearsEl}:{daysEl}:{timeEl}
      </span>
    );
  }

  if (days > 0) {
    return (
      <span>
        {daysEl}:{timeEl}
      </span>
    );
  }

  return <span>{timeEl}</span>;
};
