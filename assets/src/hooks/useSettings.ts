import { useLocalStorage } from '~/hooks/useLocalStorage';
import { Theme } from '~/config/theme';
import { useEffect } from 'react';

export const useSettings = () => {
  const [autoRefresh, setAutoRefresh] = useLocalStorage('auto-refresh', false);
  const [syncRefresh, setSyncRefresh] = useLocalStorage('sync-refresh', false);
  const [theme, setTheme] = useLocalStorage('theme', Theme.system);
  const [allowMutators, setAllowMutators] = useLocalStorage('allow-mutators', false);

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme !== Theme.system && root.classList.contains(theme)) {
      return;
    }

    root.classList.remove('light', 'dark');

    if (theme === Theme.system) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return {
    autoRefresh,
    setAutoRefresh,
    syncRefresh,
    setSyncRefresh,
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
    allowMutators,
    setAllowMutators,
  };
};
