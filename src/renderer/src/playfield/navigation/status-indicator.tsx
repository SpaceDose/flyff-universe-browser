import {type FC, useEffect, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {useSettings} from '../../provider/settings-provider';

type StatusRowProps = {
  label: string;
  value: string;
  state: 'on' | 'off' | 'pending';
  title: string;
  onClick?: () => void;
};

const StatusRow: FC<StatusRowProps> = ({
  label,
  value,
  state,
  title,
  onClick,
}) => {
  const content = (
    <>
      <span
        className={twMerge(
          'size-1.5 shrink-0 rounded-full',
          state === 'on' && 'bg-blue-light',
          state === 'off' && 'bg-white/30',
          state === 'pending' && 'bg-yellow',
        )}
      />
      <span className='text-white/60'>{label}</span>
      <span className={twMerge(state === 'off' && 'text-white/60')}>
        {value}
      </span>
    </>
  );

  // Negative margin keeps the text aligned with non-clickable rows while giving
  // the hover background some room.
  return onClick ? (
    <button
      type='button'
      onClick={onClick}
      title={title}
      className='hover:bg-gray-light -mx-1.5 flex items-center gap-1.5 rounded-sm px-1.5'
    >
      {content}
    </button>
  ) : (
    <div className='flex items-center gap-1.5' title={title}>
      {content}
    </div>
  );
};

export const StatusIndicator: FC = () => {
  const settings = useSettings();
  const [unlimitedFpsActive, setUnlimitedFpsActive] = useState(false);

  useEffect(() => {
    window.api.isUnlimitedFpsActive().then(setUnlimitedFpsActive);
  }, []);

  if (!settings) return null;

  const hotkeysEnabled = settings.hotkeysEnabled !== false;
  const fpsRestartPending = !!settings.unlimitedFps !== unlimitedFpsActive;

  return (
    <div className='flex shrink-0 flex-col justify-center gap-1 text-xs whitespace-nowrap select-none'>
      <StatusRow
        label='Hotkeys'
        value={hotkeysEnabled ? 'On' : 'Off'}
        state={hotkeysEnabled ? 'on' : 'off'}
        title={
          settings.toggleHotkey
            ? 'Client hotkey forwarding. Click to toggle, or use your toggle hotkey.'
            : 'Client hotkey forwarding. Click to toggle.'
        }
        onClick={() =>
          window.api.setSettings({...settings, hotkeysEnabled: !hotkeysEnabled})
        }
      />
      <StatusRow
        label='FPS'
        value={
          (unlimitedFpsActive ? 'Unlocked' : 'Capped') +
          (fpsRestartPending ? ' · restart' : '')
        }
        state={
          fpsRestartPending ? 'pending' : unlimitedFpsActive ? 'on' : 'off'
        }
        title={
          fpsRestartPending
            ? 'The Unlimited FPS setting changed and takes effect after an app restart.'
            : 'Unlimited FPS (frame unlock), set under Settings → General.'
        }
      />
    </div>
  );
};
