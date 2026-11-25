import {randomUUID} from 'node:crypto';
import {BrowserWindow, type IpcMainInvokeEvent, ipcMain} from 'electron';
import type {Client} from '../preload/types';
import {win} from '.';
import {db} from './database';
import {playfield, pushPlayfieldUpdate} from './playfield/playfield';
import {createBrowserView} from './utils';

export let clients: Client[] = db.get('clients', []);

export const getClientById = (id: string) => {
  const client = clients.find((client) => client.id === id);
  if (!client) throw Error('client not found...');

  return client;
};

// BrowserView and BrowserWindow are native objects that can neither be stored nor sent over IPC.
const serializableClients = () =>
  clients.map(({view, window, ...client}) => client);

export const pushClientsUpdate = () => {
  const clientsWithoutViews = serializableClients();

  db.set('clients', clientsWithoutViews);

  win?.webContents.send('pushClientsUpdate', clientsWithoutViews);
  pushPlayfieldUpdate();
};

const reorderClients = (_: IpcMainInvokeEvent, reorderedClients: Client[]) => {
  clients = reorderedClients.map((client) => getClientById(client.id));
  pushClientsUpdate();
};

const addClient = () => {
  const id = randomUUID();
  clients.push({
    id,
    view: createBrowserView(id),
  });

  pushClientsUpdate();
};

const removeClient = (_: IpcMainInvokeEvent, clientId: string) => {
  const index = clients.findIndex((client) => client.id === clientId);
  if (index === -1) return;

  const client = clients[index];
  const panel = playfield.panels.find((panel) => panel.clientId === clientId);
  if (panel) panel.clientId = undefined;

  if (client.view) {
    win?.removeBrowserView(client.view);
    client.view.webContents.close();
  }
  client.window?.destroy();
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

  if (
    (alreadyOpenPanel?.index === panelIndex && clientToOpen?.view) ||
    clientToOpen?.window
  ) {
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

const closeClient = (_: IpcMainInvokeEvent, clientId: string) => {
  const client = getClientById(clientId);
  if (client.view) {
    client.view.webContents.close({waitForBeforeUnload: true});
    client.view = undefined;
    const panel = playfield.panels.find(
      (panel) => panel.clientId === client.id,
    );
    if (panel) panel.clientId = undefined;
    pushClientsUpdate();
  }
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

const toggleMuted = (_: IpcMainInvokeEvent, clientId: string) => {
  const client = getClientById(clientId);
  client.isMuted = !client.isMuted;
  if (client.view) client.view.webContents.setAudioMuted(client.isMuted);
  pushClientsUpdate();
};

export const registerClientHandlers = () => {
  ipcMain.handle('getClients', serializableClients);
  ipcMain.on('reorderClients', reorderClients);
  ipcMain.on('addClient', addClient);
  ipcMain.on('removeClient', removeClient);
  ipcMain.on('openClient', openClient);
  ipcMain.on('closeClient', closeClient);
  ipcMain.on('openWindow', openWindow);
  ipcMain.on('renameClient', renameClient);
  ipcMain.on('closeWindow', closeWindow);
  ipcMain.on('toggleMuted', toggleMuted);
};
