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
      ]}
    />
  );
};
