import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Layout } from './layout';
import { landingRoutes } from '~/landing/routes/landing-routes';
import { NotFoundPage } from '~/pages/not-found';

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      ...landingRoutes,
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export const browserRouter = createBrowserRouter(routes);
