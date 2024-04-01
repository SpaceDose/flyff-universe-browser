import {type IpcMainInvokeEvent, ipcMain, BrowserWindow} from 'electron';
import {v4} from 'uuid';
import {type Client} from '../preload/types';
import {db} from './database';
import {panelSettings, pushPanelSettingsUpdate} from './panels/panels';
import {createBrowserView, replaceMenu} from './utils';
import {win} from '.';

export const clients: Client[] = db.get('clients', []);

export const pushClientsUpdate = () => {
  const clientsWithoutViews = clients.map((client) => {
    const {view, window, ...clientWithoutView} = client;
    return clientWithoutView;
  });

  db.set('clients', clientsWithoutViews);

  win?.webContents.send('pushClientsUpdate', clientsWithoutViews);
  pushPanelSettingsUpdate();
};

const addClient = () => {
  const id = v4();
  clients.push({
    id,
    view: createBrowserView(id),
    order: clients.length,
  });

  pushClientsUpdate();
};

export const _openClient = (clientId: string, panelIndex: number) => {
  const clientToOpen = clients.find((client) => client.id === clientId);
  const alreadyOpenPanel = panelSettings.panels.find(
    (p) => p.clientId === clientId,
  );
  if (clientToOpen?.window || alreadyOpenPanel?.index === panelIndex) return;

  if (alreadyOpenPanel) alreadyOpenPanel.clientId = undefined;

  const panelToSwap = panelSettings.panels.find(
    (settings) => settings.index === panelIndex,
  );
  const clientToClose = clients.find((c) => c.id === panelToSwap?.clientId);
  if (clientToClose?.view) win?.removeBrowserView(clientToClose.view);

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

const openClientInNewWindow = (_: IpcMainInvokeEvent, clientId: string) => {
  const clientToOpen = clients.find((c) => c.id === clientId);
  if (!clientToOpen || clientToOpen?.window) return;

  const alreadyOpenPanel = panelSettings.panels.find(
    (p) => p.clientId === clientId,
  );

  if (alreadyOpenPanel) {
    alreadyOpenPanel.clientId = undefined;
    if (clientToOpen.view) win?.removeBrowserView(clientToOpen.view);
  }

  const {width, height, x, y} = db.get('windowSettings', {
    width: 1024,
    height: 720,
  });

  clientToOpen.openInNewWindow = true;
  clientToOpen.window = new BrowserWindow({
    title: clientToOpen.character,
    width,
    height,
    x: x ? x + 24 : undefined,
    y: y ? y + 24 : undefined,
  });
  replaceMenu(clientToOpen.window);

  clientToOpen.view = clientToOpen.view ?? createBrowserView(clientId);

  clientToOpen.window.addBrowserView(clientToOpen.view);
  const bounds = clientToOpen.window.getContentBounds();
  if (bounds) clientToOpen.view.setBounds({...bounds, x: 0, y: 0});
  clientToOpen.view.setAutoResize({width: true, height: true});

  clientToOpen.window.on('close', () => {
    clientToOpen.openInNewWindow = false;
    clientToOpen.window?.destroy();
    clientToOpen.window = undefined;
    pushClientsUpdate();
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
  ipcMain.on('openClientInNewWindow', openClientInNewWindow);
  ipcMain.on('closeClient', removeClient);
  ipcMain.on('moveClientLeft', moveClientLeft);
  ipcMain.on('moveClientRight', moveClientRight);
};
