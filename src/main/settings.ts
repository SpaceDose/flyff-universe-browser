import {type IpcMainInvokeEvent, ipcMain} from 'electron';
import {type Settings as Settings} from '../preload/types';
import {clients, pushClientsUpdate} from './clients';
import {db} from './database';
import {playfield} from './playfield/panels';
import {win} from '.';

export const settings: Settings = db.get('settings', {
  focusOnHover: true,
});

const pushSettingsUpdate = () => {
  db.set('settings', settings);
  win?.webContents.send('pushSettingsUpdate', settings);
};

const setSettings = (_: IpcMainInvokeEvent, {focusOnHover}: Settings) => {
  settings.focusOnHover = focusOnHover;
  pushSettingsUpdate();
};

const hideAllViews = () => {
  clients.forEach((client) => {
    if (client.view) win?.removeBrowserView(client.view);
  });
};

const showAllViews = () => {
  const openClientIds = playfield.panels.map((panel) => panel.clientId);
  clients.forEach((client) => {
    if (client.view && openClientIds.includes(client.id)) {
      win?.addBrowserView(client.view);
    }
  });

  pushClientsUpdate();
};

export const registerSettingsHandlers = () => {
  ipcMain.handle('getSettings', () => settings);
  ipcMain.on('setSettings', setSettings);
  ipcMain.on('hideAllViews', hideAllViews);
  ipcMain.on('showAllViews', showAllViews);
};
