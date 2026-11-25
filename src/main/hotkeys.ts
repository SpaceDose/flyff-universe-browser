import {type IpcMainInvokeEvent, ipcMain} from 'electron';
import {clients, getClientById, pushClientsUpdate} from './clients';
import {pushSettingsUpdate, settings} from './settings';

// Hotkeys are stored as "Modifier+...+Code" using KeyboardEvent.code (physical key),
// e.g. "Shift+Digit2", so they don't depend on the keyboard layout.
const MODIFIER_ORDER = ['Control', 'Alt', 'Shift', 'Meta'] as const;

// KeyboardEvent.code -> Electron accelerator key code (required by sendInputEvent).
const codeToKeyCode = (code: string): string | undefined => {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) return code;
  if (/^Numpad[0-9]$/.test(code)) return `num${code.slice(6)}`;

  return {
    Space: 'Space',
    Tab: 'Tab',
    Backspace: 'Backspace',
    Delete: 'Delete',
    Insert: 'Insert',
    Enter: 'Return',
    Escape: 'Escape',
    Home: 'Home',
    End: 'End',
    PageUp: 'PageUp',
    PageDown: 'PageDown',
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    Semicolon: ';',
    Quote: "'",
    Comma: ',',
    Period: '.',
    Slash: '/',
    Backquote: '`',
    NumpadAdd: 'numadd',
    NumpadSubtract: 'numsub',
    NumpadMultiply: 'nummult',
    NumpadDivide: 'numdiv',
    NumpadDecimal: 'numdec',
    NumpadEnter: 'Return',
  }[code];
};

const hotkeyFromInput = (input: Electron.Input) => {
  const active = {
    Control: input.control,
    Alt: input.alt,
    Shift: input.shift,
    Meta: input.meta,
  };
  return [...MODIFIER_ORDER.filter((m) => active[m]), input.code].join('+');
};

const isValidHotkey = (hotkey: string) => {
  const parts = hotkey.split('+');
  const code = parts.pop() ?? '';
  return (
    !!codeToKeyCode(code) &&
    parts.every((p) => (MODIFIER_ORDER as readonly string[]).includes(p))
  );
};

// Remembers which client received a forwarded keyDown, so the matching keyUp goes
// there too, even if a modifier was released first and the combo no longer matches.
const forwardedKeys = new Map<string, string>();

const sendKey = (
  targetId: string,
  type: 'keyDown' | 'keyUp',
  input: Electron.Input,
) => {
  const target = clients.find((c) => c.id === targetId);
  const keyCode = codeToKeyCode(input.code);
  if (!target?.view || target.view.webContents.isDestroyed() || !keyCode) {
    return;
  }

  const modifiers: Electron.KeyboardInputEvent['modifiers'] = [];
  if (input.shift) modifiers.push('shift');
  if (input.control) modifiers.push('control');
  if (input.alt) modifiers.push('alt');
  if (input.meta) modifiers.push('meta');
  if (input.isAutoRepeat) modifiers.push('isautorepeat');

  const {webContents} = target.view;
  webContents.sendInputEvent({type, keyCode, modifiers});

  // A real key press also produces a 'char' event for printable characters.
  if (
    type === 'keyDown' &&
    input.key.length === 1 &&
    !input.control &&
    !input.meta
  ) {
    webContents.sendInputEvent({type: 'char', keyCode: input.key, modifiers});
  }
};

// Called from every client's 'before-input-event'. Returns true if the input was
// handled here (forwarded to another client or used as the toggle hotkey) and
// must not reach the source client.
export const forwardHotkey = (
  sourceId: string,
  input: Electron.Input,
): boolean => {
  if (input.type === 'keyUp') {
    const targetId = forwardedKeys.get(input.code);
    if (!targetId || targetId === sourceId) return false;
    forwardedKeys.delete(input.code);
    sendKey(targetId, 'keyUp', input);
    return true;
  }

  if (input.type !== 'keyDown') return false;

  const hotkey = hotkeyFromInput(input);
  if (hotkey === settings.toggleHotkey) {
    if (!input.isAutoRepeat) {
      settings.hotkeysEnabled = settings.hotkeysEnabled === false;
      pushSettingsUpdate();
    }
    return true;
  }

  if (settings.hotkeysEnabled === false) return false;

  const target = clients.find((c) => c.hotkeys?.includes(hotkey));
  if (!target || target.id === sourceId) return false;

  forwardedKeys.set(input.code, target.id);
  sendKey(target.id, 'keyDown', input);
  return true;
};

const addHotkey = (_: IpcMainInvokeEvent, clientId: string, hotkey: string) => {
  if (!isValidHotkey(hotkey)) return;
  const client = getClientById(clientId);

  // A hotkey can only belong to one client. The latest assignment wins.
  clients.forEach((c) => {
    c.hotkeys = c.hotkeys?.filter((h) => h !== hotkey);
  });
  client.hotkeys = [...(client.hotkeys ?? []), hotkey];
  if (settings.toggleHotkey === hotkey) {
    settings.toggleHotkey = undefined;
    pushSettingsUpdate();
  }

  pushClientsUpdate();
};

const removeHotkey = (
  _: IpcMainInvokeEvent,
  clientId: string,
  hotkey: string,
) => {
  const client = getClientById(clientId);
  client.hotkeys = client.hotkeys?.filter((h) => h !== hotkey);
  pushClientsUpdate();
};

const setToggleHotkey = (_: IpcMainInvokeEvent, hotkey?: string) => {
  if (hotkey && !isValidHotkey(hotkey)) return;
  settings.toggleHotkey = hotkey;

  if (hotkey) {
    clients.forEach((c) => {
      c.hotkeys = c.hotkeys?.filter((h) => h !== hotkey);
    });
    pushClientsUpdate();
  }

  pushSettingsUpdate();
};

export const registerHotkeyHandlers = () => {
  ipcMain.on('addHotkey', addHotkey);
  ipcMain.on('removeHotkey', removeHotkey);
  ipcMain.on('setToggleHotkey', setToggleHotkey);
};
