import { useLocation } from 'react-router';
import { Link as ReactLink } from 'react-router-dom';
import { ROUTES } from '~/shared/const';
import { RouteValues } from '~/shared/const/routes';
import { useLogout } from '~/api/use-logout';

interface HeaderLinks {
  title: string;
  url: RouteValues;
}

const HEADER_LINKS: HeaderLinks[] = [
  {
    title: 'Dashboard',
    url: ROUTES.HOME,
  },
  {
    title: 'Settings',
    url: ROUTES.SETTINGS,
  },
];

export const Header = () => {
  const location = useLocation();
  const useLogoutMutation = useLogout();

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) {
      return;
    }

    useLogoutMutation.mutateAsync(undefined, undefined).then(() => window.location.reload());
  };

  return (
    <div className='flex h-16 items-center gap-4 bg-gray-100 px-4 dark:bg-black dark:text-white'>
      <ReactLink to={'/'}>
        <div className='flex items-center gap-1'>
          <img loading={'lazy'} src='/logo.svg' className='h-10 w-10' alt={'logo'} />
        </div>
      </ReactLink>
      {HEADER_LINKS.map(route => {
        const isActive = location.pathname == route.url;
        return (
          <ReactLink to={route.url} key={route.url}>
            <button className={isActive ? 'font-bold' : ''}>{route.title}</button>
          </ReactLink>
        );
      })}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
