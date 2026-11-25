import {type IpcMainInvokeEvent, ipcMain} from 'electron';
import type {Settings} from '../preload/types';
import {win} from '.';
import {clients, pushClientsUpdate} from './clients';
import {db} from './database';
import {playfield} from './playfield/playfield';

export const settings: Settings = db.get('settings', {
  focusOnHover: true,
  openNavigationOnHover: true,
});

// Chromium switches are applied once at startup, so this is what is actually active
// until the next restart, regardless of later changes to settings.unlimitedFps.
export const unlimitedFpsActive = !!settings.unlimitedFps;

export const pushSettingsUpdate = () => {
  db.set('settings', settings);
  win?.webContents.send('pushSettingsUpdate', settings);
};

const setSettings = (
  _: IpcMainInvokeEvent,
  {focusOnHover, openNavigationOnHover, unlimitedFps, hotkeysEnabled}: Settings,
) => {
  settings.focusOnHover = focusOnHover;
  settings.openNavigationOnHover = openNavigationOnHover;
  settings.unlimitedFps = unlimitedFps;
  settings.hotkeysEnabled = hotkeysEnabled;
  pushSettingsUpdate();
};

const hideAllViews = () => {
  clients.forEach((client) => {
    if (client.view) win?.removeBrowserView(client.view);
  });
};

const showAllViews = () => {
  const openClientIds = playfield.panels.map(
    (panel) => panel.active && panel.clientId,
  );
  clients.forEach((client) => {
    if (client.view && openClientIds.includes(client.id)) {
      win?.addBrowserView(client.view);
    }
  });

  pushClientsUpdate();
};

export const registerSettingsHandlers = () => {
  ipcMain.handle('getSettings', () => settings);
  ipcMain.handle('isUnlimitedFpsActive', () => unlimitedFpsActive);
  ipcMain.on('setSettings', setSettings);
  ipcMain.on('hideAllViews', hideAllViews);
  ipcMain.on('showAllViews', showAllViews);
};
