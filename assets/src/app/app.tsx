import React from 'react';
import { ProviderRootStore } from '~/main/context-provider';
import { AppRouter } from '~/app/providers/router';
import { ThemeProvider } from '~/app/providers/theme';
import { ReactQueryProvider } from '~/app/providers/react-query';

export const App = () => (
  <React.StrictMode>
    <ProviderRootStore>
      <ReactQueryProvider>
        <ThemeProvider defaultTheme='system'>
          <AppRouter />
        </ThemeProvider>
      </ReactQueryProvider>
    </ProviderRootStore>
  </React.StrictMode>
);
