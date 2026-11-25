import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import {type FC, type KeyboardEvent, useState} from 'react';

const MODIFIER_KEYS = ['Control', 'Alt', 'Shift', 'Meta'];

// Same format as the main process expects: modifiers in fixed order, then KeyboardEvent.code.
const hotkeyFromEvent = (e: KeyboardEvent) =>
  [
    e.ctrlKey && 'Control',
    e.altKey && 'Alt',
    e.shiftKey && 'Shift',
    e.metaKey && 'Meta',
    e.code,
  ]
    .filter(Boolean)
    .join('+');

const formatHotkey = (hotkey: string) =>
  hotkey
    .split('+')
    .map((part) =>
      part
        .replace(/^Control$/, 'Ctrl')
        .replace(/^Key(?=[A-Z]$)/, '')
        .replace(/^Digit/, '')
        .replace(/^Numpad/, 'Num ')
        .replace(/^Arrow/, ''),
    )
    .join(' + ');

export const HotkeyChip: FC<{hotkey: string; onRemove: () => void}> = ({
  hotkey,
  onRemove,
}) => (
  <span className='bg-gray-lighter flex h-7 items-center gap-1 rounded-sm pr-1 pl-2.5 text-sm font-semibold'>
    {formatHotkey(hotkey)}
    <button
      type='button'
      onClick={onRemove}
      title='Remove hotkey'
      className='rounded-sm p-0.5 opacity-50 hover:bg-white/10 hover:opacity-100'
    >
      <XMarkIcon className='w-3.5' />
    </button>
  </span>
);

type HotkeyRecorderProps = {
  label: string;
  onRecord: (hotkey: string) => void;
};

// Click it, then press a key (optionally with modifiers) to record a hotkey.
// Clicking elsewhere cancels.
export const HotkeyRecorder: FC<HotkeyRecorderProps> = ({label, onRecord}) => {
  const [isRecording, setIsRecording] = useState(false);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (MODIFIER_KEYS.includes(e.key)) return;

    onRecord(hotkeyFromEvent(e));
    setIsRecording(false);
    e.currentTarget.blur();
  };

  return (
    <button
      type='button'
      onClick={() => setIsRecording(true)}
      onBlur={() => setIsRecording(false)}
      onKeyDown={isRecording ? onKeyDown : undefined}
      className={`h-7 shrink-0 rounded-sm border border-dashed px-2.5 text-sm ${
        isRecording
          ? 'border-blue-lighter text-blue-lighter animate-pulse'
          : 'border-white/30 text-white/60 hover:border-white/60 hover:text-white'
      }`}
    >
      {isRecording ? 'Press a key…' : label}
    </button>
  );
};
