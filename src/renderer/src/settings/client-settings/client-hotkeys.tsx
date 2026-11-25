import type {FC} from 'react';
import type {Client} from '../../../../preload/types';
import {HotkeyChip, HotkeyRecorder} from '../../components/hotkey';
import {InfoTooltip} from '../../components/info-tooltip';

export const ClientHotkeys: FC<{client: Client}> = ({client}) => (
  <div className='flex flex-col gap-2 px-1.5'>
    <div className='flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/60 uppercase'>
      Hotkeys
      <InfoTooltip>
        Keys you press in any other client are sent to this client instead, e.g.
        to use a skill without switching windows. Each key belongs to only one
        client. Assigning it here removes it from the others. Combinations with
        Shift, Ctrl or Alt count as separate hotkeys.
      </InfoTooltip>
    </div>
    <div className='flex flex-wrap items-center gap-2'>
      {client.hotkeys?.map((hotkey) => (
        <HotkeyChip
          key={hotkey}
          hotkey={hotkey}
          onRemove={() => window.api.removeHotkey(client.id, hotkey)}
        />
      ))}
      <HotkeyRecorder
        label='+ Add hotkey'
        onRecord={(hotkey) => window.api.addHotkey(client.id, hotkey)}
      />
    </div>
  </div>
);
