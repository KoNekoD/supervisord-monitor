import { RouterProvider as BrowserRouterProvider } from 'react-router-dom';
import React from 'react';
import { ProviderRootStore } from '~/main/context-provider';
import { browserRouter } from '~/main/routes';

export const App = () => (
  <React.StrictMode>
    <ProviderRootStore>
      <BrowserRouterProvider router={browserRouter} />
    </ProviderRootStore>
  </React.StrictMode>
);
