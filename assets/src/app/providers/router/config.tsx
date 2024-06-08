import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '~/pages/home';
import { NotFoundPage } from '~/pages/not-found';
import { SettingsPage } from '~/pages/settings';
import { ROUTES } from '~/shared/const';
import { MainLayout } from '~/app/layout/main';
import { LoginPage } from '~/pages/login';
import { PrivateRoute } from './private-route';
import { PublicRoute } from '~/app/providers/router/public-route';

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
