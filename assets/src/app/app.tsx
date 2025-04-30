import { AppRouter } from '~/providers/router';
import { ReactQueryProvider } from '~/providers/react-query';
import { SessionProvider } from '~/providers/session';
import { StrictMode } from 'react';
import { ClockProvider } from '~/providers/clock/context';

export const App = () => (
  <StrictMode>
    <ReactQueryProvider>
      <SessionProvider>
        <ClockProvider>
          <AppRouter />
        </ClockProvider>
      </SessionProvider>
    </ReactQueryProvider>
  </StrictMode>
);
