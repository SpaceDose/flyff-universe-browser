import type {FC} from 'react';
import {HotkeyChip, HotkeyRecorder} from '../components/hotkey';
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
        <Switch
          key={2}
          label='Unlimited FPS (experimental)'
          description="Remove the frame rate cap (normally your monitor's refresh rate) for all clients. Increases CPU and GPU load. May have no effect depending on your system. Requires an app restart."
          defaultChecked={!!settings?.unlimitedFps}
          onChange={(e) =>
            window.api.setSettings({
              ...settings,
              unlimitedFps: e.target.checked,
            })
          }
        />,
        <Switch
          key={3}
          label='Client hotkeys'
          description='Forward the hotkeys configured for a client to that client, no matter which client is focused. Disable this e.g. while chatting.'
          defaultChecked={settings?.hotkeysEnabled !== false}
          onChange={(e) =>
            window.api.setSettings({
              ...settings,
              hotkeysEnabled: e.target.checked,
            })
          }
        />,
        <div key={4} className='flex items-center justify-between gap-6'>
          <div>
            <p className='select-none'>Toggle client hotkeys</p>
            <p className='text-sm text-white/50 select-none'>
              A key that turns client hotkeys on or off while playing, e.g.
              before you start chatting. Works in every client.
            </p>
          </div>
          {settings.toggleHotkey ? (
            <HotkeyChip
              hotkey={settings.toggleHotkey}
              onRemove={() => window.api.setToggleHotkey(undefined)}
            />
          ) : (
            <HotkeyRecorder
              label='Set hotkey'
              onRecord={(hotkey) => window.api.setToggleHotkey(hotkey)}
            />
          )}
        </div>,
      ]}
    />
  );
};
