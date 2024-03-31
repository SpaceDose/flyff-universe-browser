import {
  type ReactNode,
  type FC,
  useEffect,
  useState,
  createContext,
} from 'react';
import {type PanelSettings} from 'src/preload/types';

type PanelSettingsProviderProps = {
  children: ReactNode;
};

const defaultValues: PanelSettings = {
  panels: [],
  splitX: 512,
  splitY: 304,
  padding: 12,
  navigationHeight: 112,
  showNavigation: true,
};

export const PanelSettingsContext = createContext<PanelSettings>(defaultValues);

export const PanelSettingsProvider: FC<PanelSettingsProviderProps> = ({
  children,
}) => {
  const [panelSettings, setPanelSettings] =
    useState<PanelSettings>(defaultValues);

  useEffect(() => {
    window.api
      .getPanelSettings()
      .then((pSettings) => setPanelSettings(pSettings));
  }, []);

  useEffect(() => {
    const pushPanelSettingsUpdateEl = window.api.pushPanelSettingsUpdate(
      (_, settings) => setPanelSettings(settings),
    );

    return () => {
      pushPanelSettingsUpdateEl();
    };
  }, []);

  return (
    <PanelSettingsContext.Provider value={panelSettings}>
      {children}
    </PanelSettingsContext.Provider>
  );
};
