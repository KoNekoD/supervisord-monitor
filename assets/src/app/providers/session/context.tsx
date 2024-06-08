import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '~/api/use-get-me';

export interface ISessionContext {
  user: ApiUser;
  setUser: (user: ApiUser) => void;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setStatus: (status: 'loading' | 'authenticated' | 'unauthenticated') => void;
}

const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  // @ts-ignore
  const [user, setUser] = useState<ApiUserUserMe>(null);
  const [status, setStatus] = useState<ISessionContext['status']>('loading');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getMe().then(response => {
          setUser(response.data);
          setStatus('authenticated');
        });
      } catch (error) {
        setStatus('unauthenticated');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (status === 'loading') {
      setStatus('loading');
    } else if (status === 'unauthenticated') {
      setStatus('unauthenticated');
    } else if (user) {
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, [user, status]);

  return <SessionContext.Provider value={{ user, setUser, status, setStatus }}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within an SessionProvider');
  }
  return context;
};
