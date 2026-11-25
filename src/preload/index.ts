import {electronAPI} from '@electron-toolkit/preload';
import {contextBridge, ipcRenderer} from 'electron';
import type {API} from './api';

const push =
  (updateCallback: string) =>
  // biome-ignore lint/suspicious/noExplicitAny: IPC payloads are untyped
  (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(updateCallback, callback);

    return () => ipcRenderer.removeListener(updateCallback, callback);
  };

const api: API = {
  // database
  getStoreValue: (key) => ipcRenderer.invoke('getStoreValue', key),
  setStoreValue: (key, value) => ipcRenderer.send('setStoreValue', key, value),

  // panel
  getPlayfield: () => ipcRenderer.invoke('getPlayfield'),
  setPlayfield: (playfield) => ipcRenderer.invoke('setPlayfield', playfield),

  addPanel: () => ipcRenderer.send('addPanel'),
  removePanel: () => ipcRenderer.send('removePanel'),
  setSplits: (x, y) => ipcRenderer.invoke('setSplits', x, y),

  // client
  getClients: () => ipcRenderer.invoke('getClients'),
  reorderClients: (orderedClients) =>
    ipcRenderer.send('reorderClients', orderedClients),
  addClient: () => ipcRenderer.send('addClient'),
  removeClient: (clientId) => ipcRenderer.send('removeClient', clientId),
  openClient: (clientId, panelIndex) =>
    ipcRenderer.send('openClient', clientId, panelIndex),
  closeClient: (clientId) => ipcRenderer.send('closeClient', clientId),
  openWindow: (clientId) => ipcRenderer.send('openWindow', clientId),
  closeWindow: (clientId) => ipcRenderer.send('closeWindow', clientId),
  renameClient: (clientId, name) =>
    ipcRenderer.send('renameClient', clientId, name),
  toggleMuted: (clientId) => ipcRenderer.send('toggleMuted', clientId),
  addHotkey: (clientId, hotkey) =>
    ipcRenderer.send('addHotkey', clientId, hotkey),
  removeHotkey: (clientId, hotkey) =>
    ipcRenderer.send('removeHotkey', clientId, hotkey),
  setToggleHotkey: (hotkey) => ipcRenderer.send('setToggleHotkey', hotkey),

  hideAllViews: () => ipcRenderer.send('hideAllViews'),
  showAllViews: () => ipcRenderer.send('showAllViews'),

  // user-settings
  getSettings: () => ipcRenderer.invoke('getSettings'),
  setSettings: (settings) => ipcRenderer.send('setSettings', settings),
  isUnlimitedFpsActive: () => ipcRenderer.invoke('isUnlimitedFpsActive'),

  // update frontend
  pullPlayfieldUpdate: () => ipcRenderer.invoke('pullPlayfieldUpdate'),
  pushClientsUpdate: push('pushClientsUpdate'),
  pushPlayfieldUpdate: push('pushPlayfieldUpdate'),
  pushSettingsUpdate: push('pushSettingsUpdate'),

  // handle app updates
  installUpdate: () => ipcRenderer.invoke('installUpdate'),
  pushUpdateAvailable: push('pushUpdateAvailable'),
  pushUpdateReadyToInstall: push('pushUpdateReadyToInstall'),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
