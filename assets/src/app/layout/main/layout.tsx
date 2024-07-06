import { observer } from 'mobx-react-lite';
import { Header } from '~/components/header';

export const MainLayout = observer(({ children }: { children: any }) => {
  return (
    <div className='min-h-screen'>
      <Header />
      {children}
    </div>
  );
});
