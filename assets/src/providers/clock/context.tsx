import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';

export interface IClockContext {
  clock: number;
  setClock: Dispatch<SetStateAction<number>>;
}

const ClockContext = createContext<IClockContext | null>(null);

export const ClockProvider = ({ children }: { children: ReactNode }) => {
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(prevClock => prevClock + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return <ClockContext.Provider value={{ clock, setClock }}>{children}</ClockContext.Provider>;
};

export const useClock = () => {
  const context = useContext(ClockContext);
  if (!context) {
    throw new Error('useClock must be used within an ClockProvider');
  }
  return context;
};
