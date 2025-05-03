import { useLocalStorage } from '~/hooks/useLocalStorage';
import { Theme } from '~/config/theme';
import { useEffect } from 'react';

const defaultSettings = {
  autoRefresh: false,
  autoRefreshInterval: 10,
  syncRefresh: false,
  theme: Theme.system,
  allowMutators: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage('settings', defaultSettings);

  useEffect(() => {
    const root = window.document.documentElement;

    if (settings.theme !== Theme.system && root.classList.contains(settings.theme)) {
      return;
    }

    root.classList.remove('light', 'dark');

    if (settings.theme === Theme.system) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(settings.theme);
  }, [settings.theme]);

  return {
    autoRefresh: settings.autoRefresh,
    setAutoRefresh: (v: boolean) => setSettings({ ...settings, autoRefresh: v }),

    autoRefreshInterval: settings.autoRefreshInterval,
    setAutoRefreshInterval: (v: number) => setSettings({ ...settings, autoRefreshInterval: v }),

    syncRefresh: settings.syncRefresh,
    setSyncRefresh: (v: boolean) => setSettings({ ...settings, syncRefresh: v }),

    theme: settings.theme,
    setTheme: (v: Theme) => setSettings({ ...settings, theme: v }),

    allowMutators: settings.allowMutators,
    setAllowMutators: (v: boolean) => setSettings({ ...settings, allowMutators: v }),
  };
};
