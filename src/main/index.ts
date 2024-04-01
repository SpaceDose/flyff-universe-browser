import {join} from 'path';
import {electronApp, optimizer, is} from '@electron-toolkit/utils';
import {app, shell, BrowserWindow} from 'electron';
import {clients, pushClientsUpdate, registerClientHandlers} from './clients';
import {db, registerDatabaseHandlers} from './database';
import {registerPanelHandlers} from './panels/panels';
import {resizePanels} from './panels/resize';
import {registerUpdateHandlers, update} from './update';
import {keyboardShortcuts, loadSavedPanels, replaceMenu} from './utils';

export let win: BrowserWindow | null = null;

function createWindow(): void {
  const {width, height, x, y} = db.get('windowSettings', {
    width: 1024,
    height: 720,
  });

  win = new BrowserWindow({
    show: false,
    width,
    height,
    x,
    y,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });
  replaceMenu(win);
  win.flashFrame(false);
  win.webContents.on('before-input-event', keyboardShortcuts);

  win?.on('maximize', () => {
    if (win) db.set('windowSettings', win.getBounds());
  });
  win?.on('moved', () => {
    if (win) db.set('windowSettings', win.getBounds());
  });
  win?.on('resized', () => {
    if (win) db.set('windowSettings', win.getBounds());
  });
  win?.on('resize', () => {
    resizePanels();
  });

  loadSavedPanels();

  win.on('ready-to-show', () => {
    update();
    win?.show();
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return {action: 'deny'};
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  }

  win.on('close', () => {
    clients.forEach((c) => {
      c.openInNewWindow = false;
      c.window?.destroy();
    });

    pushClientsUpdate();
  });

  registerUpdateHandlers();
  registerDatabaseHandlers();
  registerPanelHandlers();
  registerClientHandlers();
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
