import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router';
import { useStore } from './context-provider';
import { Link as ReactLink } from 'react-router-dom';
import { landingHeaderRoutes } from '../landing/routes/landing-header-routes';

type SidebarRoute = {
  title: string;
  url: string;
  search?: object;
};

const routes: SidebarRoute[] = [...landingHeaderRoutes];

export const Header = observer(() => {
  const currentPath = useLocation().pathname;
  const { querySerializer } = useStore();

  return (
    <div className='flex h-16 items-center gap-4 bg-gray-100 px-4 dark:bg-black dark:text-white'>
      <ReactLink to={'/'}>
        <div className='flex items-center gap-1'>
          <img loading={'lazy'} src='/logo.svg' className='h-10 w-10' alt={'logo'} />
        </div>
      </ReactLink>
      {routes.map(route => {
        const isActive = currentPath == route.url;
        return (
          <ReactLink
            to={{
              pathname: route.url,
              search: route.search ? querySerializer.stringifyParams(route.search) : undefined,
            }}
            key={route.url}
          >
            <button className={isActive ? 'font-bold' : ''}>{route.title}</button>
          </ReactLink>
        );
      })}
    </div>
  );
});
