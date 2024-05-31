import React from 'react';
import { ProviderRootStore } from '~/main/context-provider';
import { AppRouter } from '~/app/providers/router';
import { ThemeProvider } from '~/app/providers/theme';

export const App = () => (
  <React.StrictMode>
    <ProviderRootStore>
      <ThemeProvider defaultTheme='system'>
        <AppRouter />
      </ThemeProvider>
    </ProviderRootStore>
  </React.StrictMode>
);
