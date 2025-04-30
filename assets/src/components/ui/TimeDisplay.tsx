import { HTMLAttributes } from 'react';

interface TimeDisplayProps extends HTMLAttributes<HTMLSpanElement> {
  ts: number;
}

export const TimeDisplay = ({ ts, ...props }: TimeDisplayProps) => {
  const years = Math.floor(ts / (60 * 60 * 24 * 365));
  const days = Math.floor(ts / (60 * 60 * 24)) % 365;
  const hours = Math.floor(ts / (60 * 60)) % 24;
  const minutes = Math.floor(ts / 60) % 60;
  const secs = Math.floor(ts) % 60;

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <span {...props}>
      {years > 0 && (
        <>
          <span className='text-gray-600'>{formatNumber(years)}</span>:
        </>
      )}
      {days > 0 && (
        <>
          <span className='text-gray-500'>{formatNumber(days)}</span>:
        </>
      )}
      {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(secs)}
    </span>
  );
};
