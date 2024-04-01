import {ipcMain} from 'electron';
import electronUpdater from 'electron-updater';
import {win} from '.';

const {autoUpdater} = electronUpdater;

export const update = () => {
  if (import.meta.env.PROD) {
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.autoDownload = true;
    autoUpdater.checkForUpdates();
  }

  autoUpdater.on('update-available', () => {
    win?.webContents.send('pushUpdateAvailable');
  });

  autoUpdater.on('update-downloaded', () => {
    win?.webContents.send('pushUpdateReadyToInstall');
  });
};

const installUpdate = () => autoUpdater.quitAndInstall(true, true);

export const registerUpdateHandlers = () => {
  ipcMain.handle('installUpdate', installUpdate);
};
