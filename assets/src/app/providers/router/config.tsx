import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '~/pages/home';
import { NotFoundPage } from '~/pages/not-found';
import { SettingsPage } from '~/pages/settings';
import { ROUTES } from '~/shared/const';
import { MainLayout } from '~/app/layout/main';

const ErrorPage = () => <div>Ебать ошибка</div>;

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Outlet />,
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
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
