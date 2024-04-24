import { createContext, ReactNode, useContext, useMemo } from 'react';
import {RootStore} from "./stores/store";

export const RootContext = createContext<RootStore | undefined>(undefined);

export const useStore = () => {
  const context = useContext(RootContext);
  if (context === undefined) {
    throw new Error('useStore must be used within ProviderRootStore');
  }
  return context;
};

export const ProviderRootStore = ({ children }: { children: ReactNode }) => {
  return <RootContext.Provider value={new RootStore()}>{children}</RootContext.Provider>;
};
