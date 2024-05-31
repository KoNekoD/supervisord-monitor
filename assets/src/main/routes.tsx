import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Layout } from './layout';
import { landingRoutes } from '../landing/routes/landing-routes';
import React from 'react';
import { NotFoundPage } from './pages/not-found-page';

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
  // {
  //   path: '/login',
  //   element: <LoginModal />,
  // },
  // {
  //   path: '/register',
  //   element: <RegisterModal />,
  // },
];

export const browserRouter = createBrowserRouter(routes);
