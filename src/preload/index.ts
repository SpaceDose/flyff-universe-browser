import {electronAPI} from '@electron-toolkit/preload';
import {contextBridge, ipcRenderer} from 'electron';
import {type API} from './api';

const push =
  (updateCallback: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(updateCallback, callback);

    return () => ipcRenderer.removeListener(updateCallback, callback);
  };

const api: API = {
  // database
  getStoreValue: (key) => ipcRenderer.invoke('getStoreValue', key),
  setStoreValue: (key, value) => ipcRenderer.send('setStoreValue', key, value),

  // panel
  getPanelSettings: () => ipcRenderer.invoke('getPanelSettings'),
  setPanelSettings: (settings) =>
    ipcRenderer.invoke('setPanelSettings', settings),

  addPanel: () => ipcRenderer.invoke('addPanel'),
  removePanel: () => ipcRenderer.invoke('removePanel'),
  setSplits: (x, y) => ipcRenderer.invoke('setSplits', x, y),

  // client
  getClients: () => ipcRenderer.invoke('getClients'),
  addClient: () => ipcRenderer.invoke('addClient'),
  removeClient: (clientId) => ipcRenderer.send('closeClient', clientId),
  openClient: (clientId, panelIndex) =>
    ipcRenderer.send('openClient', clientId, panelIndex),
  openClientInNewWindow: (clientId) =>
    ipcRenderer.send('openClientInNewWindow', clientId),
  moveClientLeft: (clientId) => ipcRenderer.send('moveClientLeft', clientId),
  moveClientRight: (clientId) => ipcRenderer.send('moveClientRight', clientId),

  // update frontend
  pullPanelSettingsUpdate: () => ipcRenderer.invoke('pullPanelSettingsUpdate'),
  pushClientsUpdate: push('pushClientsUpdate'),
  pushPanelSettingsUpdate: push('pushPanelSettingsUpdate'),

  // handle app updates
  installUpdate: () => ipcRenderer.invoke('installUpdate'),
  pushUpdateAvailable: push('pushUpdateAvailable'),
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
