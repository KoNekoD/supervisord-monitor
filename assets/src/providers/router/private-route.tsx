import { Navigate } from 'react-router';
import { useSession } from '~/providers/session';
import { ROUTES } from '~/const';
import { PageLoader } from '~/components/PageLoader';
import { ReactNode } from 'react';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();

  return (
    <>
      {status === 'loading' ? <PageLoader /> : status === 'authenticated' ? children : <Navigate to={ROUTES.LOGIN} />}
    </>
  );
};
