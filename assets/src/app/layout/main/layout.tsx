import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Toaster } from 'react-hot-toast';
import { Header } from '~/components/header';

export const MainLayout = observer(() => {
  return (
    <div className='min-h-screen'>
      <Toaster />
      <Header />
      <Outlet />
    </div>
  );
});
