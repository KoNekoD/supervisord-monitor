import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useStore } from '~/main/context-provider';
import { Header } from '~/components/header';

export const MainLayout = observer(() => {
  const { landingStore } = useStore();
  useEffect(() => {
    if (landingStore.isDarkThemeActive) {
      console.log('load');
      document.querySelector('html')?.classList.add('dark');
    }
  }, []);

  return (
    <div className='min-h-screen'>
      <Toaster />
      <Header />
      <Outlet />
    </div>
  );
});
