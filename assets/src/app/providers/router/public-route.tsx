import { Navigate } from 'react-router';

import { useSession } from '~/app/providers/session';
import { ROUTES } from '~/shared/const';
import { PageLoader } from '~/components/page-loader';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  return <>{status === 'loading' ? <PageLoader /> : status === 'unauthenticated' ? children : <Navigate to={ROUTES.HOME} />}</>;
};
