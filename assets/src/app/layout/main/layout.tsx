import { observer } from 'mobx-react-lite';
import { Toaster } from 'react-hot-toast';
import { Header } from '~/components/header';

export const MainLayout = observer(({ children }: { children: any }) => {
  return (
    <div className='min-h-screen'>
      <Toaster />
      <Header />
      {children}
    </div>
  );
});
