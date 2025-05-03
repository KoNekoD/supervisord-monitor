import { createBrowserRouter, Outlet } from 'react-router-dom';
import { NotFoundPage } from '~/pages/not-found/page';
import { SettingsPage } from '~/pages/settings/page';
import { ROUTES } from '~/const';
import { LoginPage } from '~/pages/login/page';
import { PrivateRoute } from './private-route';
import { PublicRoute } from '~/providers/router/public-route';
import { Toaster } from 'react-hot-toast';
import { Header } from '~/components/Header';
import { MainPage } from '~/pages/home/page';
import { useSettings } from '~/hooks/useSettings';

export const MainLayout = ({ children }: { children: any }) => {
  useSettings(); // Call for set theme class

  return (
    <div className='min-h-screen'>
      <Toaster />
      <Header />
      {children}
    </div>
  );
};

const ErrorPage = () => <div>ERROROORORO SDJSDOJSDIJIO!!!!!!! ERRROR CRITIIACALLLL!!!!!!!!!!!!!</div>;

export const router = createBrowserRouter([
  {
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <MainLayout>
            <PrivateRoute>
              <Outlet />
            </PrivateRoute>
          </MainLayout>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: ROUTES.SETTINGS,
            element: <SettingsPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
      {
        element: (
          <PublicRoute>
            <Outlet />
          </PublicRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
