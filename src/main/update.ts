import {ipcMain} from 'electron';
import electronUpdater from 'electron-updater';
import {win} from '.';

const {autoUpdater} = electronUpdater;

export const update = () => {
  if (import.meta.env.PROD) autoUpdater.checkForUpdates();

  autoUpdater.on('update-downloaded', () => {
    win?.webContents.send('pushUpdateAvailable');
  });
};

const installUpdate = () => {
  autoUpdater.quitAndInstall(true, true);
};

export const registerUpdateHandlers = () => {
  ipcMain.handle('installUpdate', installUpdate);
};
