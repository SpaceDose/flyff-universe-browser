import {ipcMain, type IpcMainInvokeEvent} from 'electron';
import {win} from '..';
import {type PanelSettings} from '../../preload/types';
import {clients} from '../clients';
import {db} from '../database';
import {resizePanels} from './resize';

export const panelSettings: PanelSettings = db.get('panelSettings', {
  panels: [{index: 0, active: true}],
  splitX: 0.5,
  splitY: 0.5,
  padding: 12,
  navigationHeight: 112,
  showNavigation: true,
});

const getPanelSettingsWithoutInactivePanels: () => PanelSettings = () => ({
  ...panelSettings,
  panels: panelSettings.panels.filter((p) => p.active),
});

export const pushPanelSettingsUpdate = () => {
  db.set('panelSettings', panelSettings);
  resizePanels();
  win?.webContents.send(
    'pushPanelSettingsUpdate',
    getPanelSettingsWithoutInactivePanels(),
  );
};

const setPanelSettings = (_: IpcMainInvokeEvent, settings: PanelSettings) => {
  Object.assign(panelSettings, settings);

  pushPanelSettingsUpdate();
  return true;
};

const addPanel = () => {
  const activePanels = panelSettings.panels.filter((panel) => panel.active);

  if (activePanels.length < 4) {
    const inactivePanel = panelSettings.panels.find((panel) => !panel.active);
    if (inactivePanel) {
      inactivePanel.active = true;
      const clientToOpen = clients.find((c) => c.id === inactivePanel.clientId);
      if (clientToOpen?.view) win?.addBrowserView(clientToOpen.view);
    } else {
      panelSettings.panels.push({
        index: panelSettings.panels.length,
        active: true,
      });
    }
    pushPanelSettingsUpdate();
  }
};

const removePanel = () => {
  const activePanels = panelSettings.panels.filter((panel) => panel.active);
  if (activePanels.length > 1) {
    const panel = activePanels.at(-1);
    if (panel) panel.active = false;

    const client = clients.find((c) => c.id === panel?.clientId);
    if (client?.view) win?.removeBrowserView(client.view);

    pushPanelSettingsUpdate();
  }
};

const setSplits = (_: IpcMainInvokeEvent, x?: number, y?: number) => {
  if (x) panelSettings.splitX = x;
  if (y) panelSettings.splitY = y;

  resizePanels();
  return true;
};

const pullPanelSettingsUpdate = () => {
  pushPanelSettingsUpdate();
  return true;
};

export const registerPanelHandlers = () => {
  ipcMain.handle('getPanelSettings', () =>
    getPanelSettingsWithoutInactivePanels(),
  );
  ipcMain.handle('setPanelSettings', setPanelSettings);
  ipcMain.handle('addPanel', addPanel);
  ipcMain.handle('removePanel', removePanel);
  ipcMain.handle('setSplits', setSplits);
  ipcMain.handle('pullPanelSettingsUpdate', pullPanelSettingsUpdate);
};
