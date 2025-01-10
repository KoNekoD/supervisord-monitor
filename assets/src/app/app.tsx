import React from 'react';
import { ProviderRootStore } from '~/main/context-provider';
import { AppRouter } from '~/app/providers/router';
import { ThemeProvider } from '~/app/providers/theme';
import { ReactQueryProvider } from '~/app/providers/react-query';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from '~/app/providers/session';

export const App = () => (
  <React.StrictMode>
    <ReactQueryProvider>
      <ProviderRootStore>
        <SessionProvider>
          <ThemeProvider defaultTheme='system'>
            <Toaster position='top-right' reverseOrder={false} />
            <AppRouter />
          </ThemeProvider>
        </SessionProvider>
      </ProviderRootStore>
    </ReactQueryProvider>
  </React.StrictMode>
);
