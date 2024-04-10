import {type IpcMainInvokeEvent, ipcMain, BrowserWindow} from 'electron';
import {v4} from 'uuid';
import {type Client} from '../preload/types';
import {db} from './database';
import {playfield, pushPlayfieldUpdate} from './playfield/playfield';
import {createBrowserView} from './utils';
import {win} from '.';

export let clients: Client[] = db.get('clients', []);

export const getClientById = (id: string) => {
  const client = clients.find((client) => client.id === id);
  if (!client) throw Error('client not found...');

  return client;
};

export const pushClientsUpdate = () => {
  const clientsWithoutViews = clients.map((client) => {
    const {view, window, ...clientWithoutView} = client;
    return clientWithoutView;
  });

  db.set('clients', clientsWithoutViews);

  win?.webContents.send('pushClientsUpdate', clientsWithoutViews);
  pushPlayfieldUpdate();
};

const reorderClients = (_: IpcMainInvokeEvent, reorderedClients: Client[]) => {
  clients = reorderedClients.map((client) => getClientById(client.id));
  pushClientsUpdate();
};

const addClient = () => {
  const id = v4();
  clients.push({
    id,
    view: createBrowserView(id),
  });

  pushClientsUpdate();
};

const removeClient = (_: IpcMainInvokeEvent, clientId: string) => {
  const index = clients.findIndex((client) => client.id === clientId);
  const client = clients[index];
  const panel = playfield.panels.find((panel) => panel.clientId === clientId);

  if (client?.view && panel) {
    panel.clientId = undefined;
    win?.removeBrowserView(client.view);
  }
  clients.splice(index, 1);

  pushClientsUpdate();
};

const openClient = (
  _: IpcMainInvokeEvent,
  clientId: string,
  panelIndex: number,
) => {
  const clientToOpen = getClientById(clientId);
  const alreadyOpenPanel = playfield.panels.find(
    (p) => p.clientId === clientId,
  );

  if (clientToOpen?.window) return;
  if (alreadyOpenPanel?.index === panelIndex && clientToOpen?.view) {
    alreadyOpenPanel.clientId = undefined;
    win?.removeBrowserView(clientToOpen.view);
    pushClientsUpdate();
    return;
  }

  if (alreadyOpenPanel) alreadyOpenPanel.clientId = undefined;

  const panelToSwap = playfield.panels.find(
    (settings) => settings.index === panelIndex,
  );
  const clientToClose = clients.find((c) => c.id === panelToSwap?.clientId);
  if (clientToClose?.view) win?.removeBrowserView(clientToClose.view);

  if (clientToOpen) {
    if (!clientToOpen.view) {
      clientToOpen.view = createBrowserView(
        clientToOpen.id,
        clientToOpen.isMuted,
      );
    }
    const panel = playfield.panels.find((p) => p.index === panelIndex);
    if (panel) panel.clientId = clientId;
    win?.addBrowserView(clientToOpen.view);
    clientToOpen.view.webContents.focus();
  }

  pushClientsUpdate();
};

const openWindow = (_: IpcMainInvokeEvent, clientId: string) => {
  const clientToOpen = getClientById(clientId);
  if (clientToOpen.window) return;

  const alreadyOpenPanel = playfield.panels.find(
    (p) => p.clientId === clientId,
  );

  if (alreadyOpenPanel) {
    alreadyOpenPanel.clientId = undefined;
    if (clientToOpen.view) win?.removeBrowserView(clientToOpen.view);
  }

  const {width, height, x, y} = db.get('window', {
    width: 1024,
    height: 720,
  });

  clientToOpen.isOpenInNewWindow = true;
  clientToOpen.window = new BrowserWindow({
    title: clientToOpen.name,
    width,
    height,
    x: x ? x + 24 : undefined,
    y: y ? y + 24 : undefined,
  });
  clientToOpen.window.setMenu(null);

  clientToOpen.view =
    clientToOpen.view ?? createBrowserView(clientId, clientToOpen.isMuted);

  clientToOpen.window.addBrowserView(clientToOpen.view);
  const bounds = clientToOpen.window.getContentBounds();
  if (bounds) clientToOpen.view.setBounds({...bounds, x: 0, y: 0});
  clientToOpen.view.setAutoResize({width: true, height: true});

  clientToOpen.window.on('close', () => {
    clientToOpen.isOpenInNewWindow = false;
    clientToOpen.window?.destroy();
    clientToOpen.window = undefined;

    pushClientsUpdate();
  });

  pushClientsUpdate();
};

const closeWindow = (_: IpcMainInvokeEvent, clientId: string) => {
  const client = getClientById(clientId);
  client.isOpenInNewWindow = false;
  client.window?.destroy();
  client.window = undefined;
  pushClientsUpdate();
};

const renameClient = (
  _: IpcMainInvokeEvent,
  clientId: string,
  name: string,
) => {
  const client = getClientById(clientId);
  client.name = name;
  pushClientsUpdate();
};

const reloadClient = (_: IpcMainInvokeEvent, clientId: string) => {
  const client = getClientById(clientId);
  if (client.view) client.view.webContents.reload();
};

const toggleMuted = (_: IpcMainInvokeEvent, clientId: string) => {
  const client = getClientById(clientId);
  client.isMuted = !client.isMuted;
  if (client.view) client.view.webContents.setAudioMuted(client.isMuted);
  pushClientsUpdate();
};

export const registerClientHandlers = () => {
  ipcMain.handle('getClients', () =>
    clients.map((client) => {
      const {view, ...clientWithoutView} = client;
      return clientWithoutView;
    }),
  );
  ipcMain.on('reorderClients', reorderClients);
  ipcMain.on('addClient', addClient);
  ipcMain.on('removeClient', removeClient);
  ipcMain.on('openClient', openClient);
  ipcMain.on('openWindow', openWindow);
  ipcMain.on('renameClient', renameClient);
  ipcMain.on('closeWindow', closeWindow);
  ipcMain.on('reloadClient', reloadClient);
  ipcMain.on('toggleMuted', toggleMuted);
};
