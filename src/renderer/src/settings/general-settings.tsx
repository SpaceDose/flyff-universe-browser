import {type FC} from 'react';
import {useSettings} from '../provider/settings-provider';
import {SettingsPage} from './settings-page';
import {Switch} from './switch';

export const GeneralSettings: FC = () => {
  const settings = useSettings();

  if (!settings) return null;

  return (
    <SettingsPage
      title='General'
      description='Enable or disable some of the general features of this app.'
      options={[
        <Switch
          key={0}
          label='Focus view on mouse enter'
          description="Switch the active focus on hover, so it's no longer necessary to click into the game to use the keyboard."
          defaultChecked={settings?.focusOnHover}
          onChange={(e) =>
            window.api.setSettings({
              ...settings,
              focusOnHover: e.target.checked,
            })
          }
        />,
        <Switch
          key={1}
          label='Open client navigation on hover'
          description='While in fullscreen, open the client navigation at the bottom on mouse hover.'
          defaultChecked={settings?.openNavigationOnHover}
          onChange={(e) =>
            window.api.setSettings({
              ...settings,
              openNavigationOnHover: e.target.checked,
            })
          }
        />,
      ]}
    />
  );
};
