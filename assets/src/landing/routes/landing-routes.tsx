import { Outlet } from 'react-router-dom';
import { LandingPage } from '~/pages/home';
import { LandingSettingsPage } from '~/pages/settings';
import { ROUTES } from '~/shared/const';

export const landingRoutes = [
  {
    path: ROUTES.HOME,
    element: <Outlet />,
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
];
