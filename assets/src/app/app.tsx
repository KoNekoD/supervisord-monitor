import { AppRouter } from '~/providers/router';
import { ReactQueryProvider } from '~/providers/react-query';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from '~/providers/session';
import { StrictMode } from 'react';
import { ClockProvider } from '~/providers/clock/context';

export const App = () => (
  <StrictMode>
    <ReactQueryProvider>
      <SessionProvider>
        <ClockProvider>
          <Toaster position='top-right' reverseOrder={false} />
          <AppRouter />
        </ClockProvider>
      </SessionProvider>
    </ReactQueryProvider>
  </StrictMode>
);
