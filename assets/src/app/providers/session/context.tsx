import { createContext, useContext, useEffect, useState } from 'react';
import { useGetMe } from '~/api/use-get-me';

export interface ISessionContext {
  user: ApiUser;
  setUser: (user: ApiUser) => void;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setStatus: (status: 'loading' | 'authenticated' | 'unauthenticated') => void;
}

const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  // @ts-ignore
  const [user, setUser] = useState<ApiUser>(null);
  const [status, setStatus] = useState<ISessionContext['status']>('loading');

  const { data, isFetching, error } = useGetMe();

  useEffect(() => {
    if (isFetching) {
      setStatus('loading');
    } else if (error) {
      setStatus('unauthenticated');
    } else if (data?.data) {
      setUser(data?.data);
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, [data, error, isFetching]);

  return <SessionContext.Provider value={{ user, setUser, status, setStatus }}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within an SessionProvider');
  }
  return context;
};

export const isHasRoleManager = () => {
  return useSession().user.roles.includes('ROLE_MANAGER')
}
