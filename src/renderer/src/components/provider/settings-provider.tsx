import {type ReactNode, type FC, useState, createContext} from 'react';
import {type Settings} from '../../../../preload/types';

type PanelSettingsProviderProps = {
  children: ReactNode;
};

const defaultValues: Settings = {
  open: false,
};

export const SettingsContext = createContext<
  (Settings & {openSettings: () => void; closeSettings: () => void}) | null
>(null);

export const SettingsProvider: FC<PanelSettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>(defaultValues);

  const openSettings = () => {
    window.api.hideAllViews();
    setSettings({open: true});
  };

  const closeSettings = () => {
    window.api.showAllViews();
    setSettings({open: false});
  };

  return (
    <SettingsContext.Provider
      value={{...settings, openSettings, closeSettings}}
    >
      {children}
    </SettingsContext.Provider>
  );
};
