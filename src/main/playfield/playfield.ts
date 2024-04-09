import {ipcMain, type IpcMainInvokeEvent} from 'electron';
import {win} from '..';
import {type Playfield} from '../../preload/types';
import {clients} from '../clients';
import {db} from '../database';
import {resizePanels} from './resize';

export const playfield: Playfield = db.get('playfield', {
  panels: [{index: 0, active: true}],
  splitX: 0.5,
  splitY: 0.5,
  padding: 12,
  navigationHeight: 112,
  showNavigation: true,
});

const getPlayfieldWithoutInactivePanels: () => Playfield = () => ({
  ...playfield,
  panels: playfield.panels.filter((p) => p.active),
});

export const pushPlayfieldUpdate = () => {
  db.set('playfield', playfield);
  resizePanels();
  win?.webContents.send(
    'pushPlayfieldUpdate',
    getPlayfieldWithoutInactivePanels(),
  );
};

const setPlayfield = (_: IpcMainInvokeEvent, settings: Playfield) => {
  Object.assign(playfield, settings);

  pushPlayfieldUpdate();
  return true;
};

const addPanel = () => {
  const activePanels = playfield.panels.filter((panel) => panel.active);

  if (activePanels.length < 4) {
    const inactivePanel = playfield.panels.find((panel) => !panel.active);
    if (inactivePanel) {
      inactivePanel.active = true;
      const clientToOpen = clients.find((c) => c.id === inactivePanel.clientId);
      if (clientToOpen?.view) win?.addBrowserView(clientToOpen.view);
    } else {
      playfield.panels.push({
        index: playfield.panels.length,
        active: true,
      });
    }
    pushPlayfieldUpdate();
  }
};

const removePanel = () => {
  const activePanels = playfield.panels.filter((panel) => panel.active);
  if (activePanels.length > 1) {
    const panel = activePanels.at(-1);
    if (panel) panel.active = false;

    const client = clients.find((c) => c.id === panel?.clientId);
    if (client?.view) win?.removeBrowserView(client.view);

    pushPlayfieldUpdate();
  }
};

const setSplits = (_: IpcMainInvokeEvent, x?: number, y?: number) => {
  if (x) playfield.splitX = x;
  if (y) playfield.splitY = y;

  resizePanels();
  return true;
};

const pullPlayfieldUpdate = () => {
  pushPlayfieldUpdate();
  return true;
};

export const registerPanelHandlers = () => {
  ipcMain.handle('getPlayfield', () => getPlayfieldWithoutInactivePanels());
  ipcMain.handle('setPlayfield', setPlayfield);
  ipcMain.on('addPanel', addPanel);
  ipcMain.on('removePanel', removePanel);
  ipcMain.handle('setSplits', setSplits);
  ipcMain.handle('pullPlayfieldUpdate', pullPlayfieldUpdate);
};
