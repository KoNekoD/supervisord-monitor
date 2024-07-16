import { Header } from '~/components/header';

export const MainLayout = ({ children }: { children: any }) => {
  return <div className="min-h-screen">
    <Header />
    {children}
  </div>;
};
