import {BrowserView, type IpcMainInvokeEvent, ipcMain, session} from 'electron';
import {v4} from 'uuid';
import {type Client} from '../preload/types';
import {db} from './database';
import {panelSettings, pushPanelSettingsUpdate} from './panels/panels';
import {resizePanels} from './panels/resize';
import {keyboardShortcuts} from './utils';
import {win} from '.';

const flyffUniverseURL =
  import.meta.env.VITE_TEST_URL ?? 'https://universe.flyff.com/play';

export const clients: Client[] = db.get('clients', []);

const pushClientsUpdate = () => {
  const clientsWithoutViews = clients.map((client) => {
    const {view, ...clientWithoutView} = client;
    return clientWithoutView;
  });

  db.set('clients', clientsWithoutViews);

  win?.webContents.send('pushClientsUpdate', clientsWithoutViews);
  pushPanelSettingsUpdate();
};

const createBrowserView: (id: string) => BrowserView = (id) => {
  const s = session.fromPartition(`persist:client-${id}`);
  const view = new BrowserView({
    webPreferences: {
      session: s,
    },
  });
  view.webContents.loadURL(flyffUniverseURL);
  view.webContents.on('before-input-event', keyboardShortcuts);

  view.webContents.addListener('cursor-changed', async () => {
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
    if (!client?.character) {
      const clientSessions: string | null = await view.webContents
        .executeJavaScript(`
        window.localStorage.getItem('game_client_sessions');
      `);

      if (client && clientSessions !== null) {
        client.character = clientSessions.split('\n')[1].split(' ').at(-1);
        pushClientsUpdate();
      }
    }
  });

  return view;
};

export const loadSavedPanels = () => {
  panelSettings.panels.forEach((panel) => {
    if (panel.active && panel.clientId) {
      const client = clients.find((client) => client.id === panel.clientId);
      if (client) {
        if (!client?.view) client.view = createBrowserView(client.id);
        win?.addBrowserView(client.view);
      }
    }
  });
  pushPanelSettingsUpdate();
  resizePanels();
};

export const _openClient = (clientId: string, panelIndex: number) => {
  const alreadyOpenPanel = panelSettings.panels.find(
    (p) => p.clientId === clientId,
  );
  if (alreadyOpenPanel?.index === panelIndex) return;

  if (alreadyOpenPanel) alreadyOpenPanel.clientId = undefined;

  const panelToSwap = panelSettings.panels.find(
    (settings) => settings.index === panelIndex,
  );
  const clientToClose = clients.find((c) => c.id === panelToSwap?.clientId);
  if (clientToClose?.view) win?.removeBrowserView(clientToClose.view);

  const clientToOpen = clients.find((client) => client.id === clientId);
  if (clientToOpen) {
    if (!clientToOpen.view) {
      clientToOpen.view = createBrowserView(clientToOpen.id);
    }
    const panel = panelSettings.panels.find((p) => p.index === panelIndex);
    if (panel) panel.clientId = clientId;
    win?.addBrowserView(clientToOpen.view);
    clientToOpen.view.webContents.focus();
  }

  pushClientsUpdate();
};

const openClient = (
  _: IpcMainInvokeEvent,
  clientId: string,
  panelIndex: number,
) => _openClient(clientId, panelIndex);

const addClient = () => {
  const id = v4();
  clients.push({
    id,
    view: createBrowserView(id),
    order: clients.length,
  });

  pushClientsUpdate();
};

const removeClient = (_: IpcMainInvokeEvent, clientId: string) => {
  const index = clients.findIndex((client) => client.id === clientId);
  const client = clients[index];
  const panel = panelSettings.panels.find(
    (panel) => panel.clientId === clientId,
  );

  if (client?.view && panel) {
    panel.clientId = undefined;
    win?.removeBrowserView(client.view);
  }

  clients.splice(index, 1);
  clients.sort((a, b) => a.order - b.order).forEach((c, i) => (c.order = i));

  pushClientsUpdate();
};

const _moveClient = (clientId: string, direction: 'left' | 'right') => {
  const f = direction === 'left' ? -1 : 1;
  const client = clients.find((c) => c.id == clientId);
  if (client) {
    const clientToSwap = clients.find((c) => c.order === client.order + f);
    if (clientToSwap) {
      clientToSwap.order -= f;
      client.order += f;
    }

    pushClientsUpdate();
  }
};

const moveClientLeft = (_: IpcMainInvokeEvent, clientId: string) =>
  _moveClient(clientId, 'left');
const moveClientRight = (_: IpcMainInvokeEvent, clientId: string) =>
  _moveClient(clientId, 'right');

export const registerClientHandlers = () => {
  ipcMain.handle('getClients', () =>
    clients.map((client) => {
      const {view, ...clientWithoutView} = client;
      return clientWithoutView;
    }),
  );
  ipcMain.handle('addClient', addClient);
  ipcMain.on('openClient', openClient);
  ipcMain.on('closeClient', removeClient);
  ipcMain.on('moveClientLeft', moveClientLeft);
  ipcMain.on('moveClientRight', moveClientRight);
};
