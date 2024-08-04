import { Header } from '~/components/header';
import React from 'react';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
};
