import { Navigate } from 'react-router';

import { useSession } from '~/providers/session';
import { ROUTES } from '~/const';
import { PageLoader } from '~/components/PageLoader';
import { ReactNode } from 'react';

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();

  return (
    <>
      {status === 'loading' ? <PageLoader /> : status === 'unauthenticated' ? children : <Navigate to={ROUTES.HOME} />}
    </>
  );
};
