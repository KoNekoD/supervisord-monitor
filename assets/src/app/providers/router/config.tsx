import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '~/pages/home';
import { NotFoundPage } from '~/pages/not-found';
import { SettingsPage } from '~/pages/settings';
import { ROUTES } from '~/shared/const';
import { MainLayout } from '~/app/layout/main';
import { LoginPage } from '~/pages/login';

const ErrorPage = () => <div>ERROROORORO SDJSDOJSDIJIO!!!!!!! ERRROR CRITIIACALLLL!!!!!!!!!!!!!</div>;

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <MainLayout>
            <Outlet />
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
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
]);
