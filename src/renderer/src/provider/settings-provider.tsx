import {
  type ReactNode,
  type FC,
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react';
import {type Settings} from '../../../preload/types';

type SettingsProviderProps = {
  children: ReactNode;
};

export const useSettings = () => useContext(SettingsContext);

const SettingsContext = createContext<Settings | null>(null);

export const SettingsProvider: FC<SettingsProviderProps> = ({children}) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    window.api.getSettings().then((s) => setSettings(s as Settings));
  }, []);

  useEffect(() => {
    const pushSettingsUpdateEl = window.api.pushSettingsUpdate((_, settings) =>
      setSettings(settings),
    );

    return () => {
      pushSettingsUpdateEl();
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
