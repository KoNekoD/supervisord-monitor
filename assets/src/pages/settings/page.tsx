import { Link as ReactLink } from 'react-router-dom';
import { isHasRoleManager } from '~/providers/session/context';
import { useSettings } from '~/hooks/useSettings';
import { toastManager } from '~/util/toastManager';
import { Checkbox } from '~/components/ui/Checkbox';
import { Theme } from '~/config/theme';

export const SettingsPage = () => {
  const isManager = isHasRoleManager();
  const { autoRefresh, setAutoRefresh, syncRefresh, setSyncRefresh, theme, setTheme, allowMutators, setAllowMutators } =
    useSettings();

  return (
    <div className={'flex h-screen w-full items-center justify-center'}>
      <div className='flex flex-col space-y-5 rounded-lg border border-black p-6 dark:border-gray-700'>
        <h5 className='mb-2 text-xl font-medium leading-tight'>Settings</h5>
        <Checkbox
          id='changeAutoRefreshCheckbox'
          text='Active auto-refresh'
          checked={autoRefresh}
          onChange={e => {
            setAutoRefresh(e.target.checked);
            toastManager.success(e.target.checked ? 'Auto refresh enabled' : 'Auto refresh disabled');
          }}
        />
        <Checkbox
          id='changeSyncRefreshCheckbox'
          text='Sync refresh'
          checked={syncRefresh}
          onChange={e => {
            setSyncRefresh(e.target.checked);
            toastManager.success(e.target.checked ? 'Sync refresh enabled' : 'Sync refresh disabled');
          }}
        />
        <Checkbox
          id='changeThemeCheckbox'
          text='Active dark theme'
          checked={theme === Theme.dark}
          onChange={e => {
            setTheme(e.target.checked ? Theme.dark : Theme.light);
            toastManager.success(e.target.checked ? 'Use dark theme' : 'Use light theme');
          }}
        />
        {isManager && (
          <Checkbox
            id='switchAllowMutatorsCheckbox'
            text='Allow mutators'
            checked={allowMutators}
            onChange={e => {
              setAllowMutators(e.target.checked);
              toastManager.success(e.target.checked ? 'Allow mutators enabled' : 'Allow mutators disabled');
            }}
          />
        )}
        <ReactLink to={'/'}>
          <div className='rounded border px-6 pb-2 pt-2.5 text-xs uppercase dark:border-gray-600'>Go to dashboard</div>
        </ReactLink>
      </div>
    </div>
  );
};
