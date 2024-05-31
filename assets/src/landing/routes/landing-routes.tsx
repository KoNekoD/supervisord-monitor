import { Outlet } from 'react-router-dom';
import { LandingPage } from '~/pages/home';
import { LandingSettingsPage } from '~/pages/settings';

export const landingRoutes = [
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'settings',
        element: <LandingSettingsPage />,
      },
    ],
  },
];
