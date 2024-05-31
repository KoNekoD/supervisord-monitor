import React from 'react';
import { ProviderRootStore } from '~/main/context-provider';
import { AppRouter } from '~/app/providers/router';

export const App = () => (
  <React.StrictMode>
    <ProviderRootStore>
      <AppRouter />
    </ProviderRootStore>
  </React.StrictMode>
);
