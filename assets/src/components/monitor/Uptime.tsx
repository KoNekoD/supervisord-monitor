import { TimeDisplay } from '~/components/ui/TimeDisplay';
import { twMerge } from 'tailwind-merge';
import { useClock } from '~/providers/clock/context';

interface UptimeProps {
  process: ApiProcess;
}

export const Uptime = ({ process }: UptimeProps) => {
  const clock = useClock();

  /**
   * STOPPED, EXITED, FATAL - Stop time
   * RUNNING - Start time
   * STARTING, STOPPING, BACKOFF, UNKNOWN - Do not show
   */
  const isTimeless = !['STOPPED', 'EXITED', 'FATAL', 'RUNNING'].includes(process.stateName);
  if (isTimeless) {
    return <></>;
  }

  const start = process.start;
  const stop = process.stop;
  const now = process.now + clock.clock;

  const isNotRunning = ['STOPPED', 'EXITED', 'FATAL'].includes(process.stateName);

  let duration = 0;

  if (isNotRunning) {
    // In case the program tried to start but did not stop because it failed to start(for example, it didn't find an executable file)
    if (start > 0 && stop === 0) {
      return <></>;
    }

    duration = stop - start;
  } else if (process.stateName === 'RUNNING') {
    duration = now - start;
  }

  return <TimeDisplay ts={duration} className={twMerge(isNotRunning && 'text-gray-400')} />;
};
