import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Layout } from '~/main/layout';
import { LandingPage } from '~/pages/home';
import { NotFoundPage } from '~/pages/not-found';
import { LandingSettingsPage } from '~/pages/settings';
import { ROUTES } from '~/shared/const';

const ErrorPage = () => <div>Ебать ошибка</div>;

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Outlet />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
          {
            path: ROUTES.SETTINGS,
            element: <LandingSettingsPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
