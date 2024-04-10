import {BrowserView, session} from 'electron';
import {_openClient, clients, pushClientsUpdate} from './clients';
import {playfield, pushPlayfieldUpdate} from './playfield/playfield';
import {resizePanels} from './playfield/resize';
import {settings} from './settings';
import {win} from '.';

const flyffUniverseURL =
  import.meta.env.VITE_TEST_URL ?? 'https://universe.flyff.com/play';

export const keyboardShortcuts: (
  event: {preventDefault: () => void},
  input: Electron.Input,
) => void = (event, input) => {
  if (input.type === 'keyDown' && input.alt && input.key === 'Enter') {
    event.preventDefault();
    const newState = !win?.isFullScreen();
    win?.setFullScreen(newState);
    playfield.isFullscreen = newState;
    pushPlayfieldUpdate();
  }
};

export const createBrowserView: (
  id: string,
  isMuted?: boolean,
) => BrowserView = (id, isMuted) => {
  const s = session.fromPartition(`persist:client-${id}`);
  const view = new BrowserView({
    webPreferences: {
      session: s,
    },
  });
  view.webContents.loadURL(flyffUniverseURL);
  view.webContents.on('before-input-event', keyboardShortcuts);

  view.webContents.addListener('cursor-changed', async () => {
    if (!settings.focusOnHover) return;

    // Focus the BrowserView on mouse enter.
    if (
      !view.webContents.isFocused() &&
      (win?.webContents.isFocused() ||
        clients.some((c) => c.view?.webContents.isFocused()))
    ) {
      view.webContents.focus();
    }

    // Try to get the characters name from localStorage.
    // 'cursor-changed' seems to be a bad trigger for this but I don't know a better one for now.
    const client = clients.find((c) => c.id === id);
    if (!client?.name) {
      const clientSessions: string | null = await view.webContents
        .executeJavaScript(`
        window.localStorage.getItem('game_client_sessions');
      `);

      if (client && clientSessions !== null) {
        client.name = clientSessions.split('\n')[1].split(' ').at(-1);
        pushClientsUpdate();
      }
    }
  });

  view.webContents.setAudioMuted(!!isMuted);

  return view;
};

export const loadSavedPanels = () => {
  playfield.panels.forEach((panel) => {
    if (panel.active && panel.clientId) {
      const client = clients.find((client) => client.id === panel.clientId);
      if (client) {
        if (!client?.view)
          client.view = createBrowserView(client.id, client.isMuted);
        win?.addBrowserView(client.view);
      }
    }
  });
  pushPlayfieldUpdate();
  resizePanels();
};
