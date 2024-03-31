import {type IpcMainInvokeEvent, app, ipcMain} from 'electron';
import Store, {type Schema} from 'electron-store';
import {type Profile} from '../preload/types';

export const schema: Schema<Profile> = {
  windowSettings: {
    type: 'object',
    properties: {
      width: {
        type: 'number',
      },
      height: {
        type: 'number',
      },
      x: {
        type: 'number',
      },
      y: {
        type: 'number',
      },
    },
  },
  panelSettings: {
    type: 'object',
    properties: {
      panels: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            index: {
              type: 'number',
            },
            clientId: {
              type: 'string',
            },
            active: {
              type: 'boolean',
            },
          },
        },
      },
      splitX: {
        type: 'number',
      },
      splitY: {
        type: 'number',
      },
      padding: {
        type: 'number',
      },
      navigationHeight: {
        type: 'number',
      },
      showNavigation: {
        type: 'boolean',
      },
    },
  },
  clients: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        character: {
          type: 'string',
        },
        order: {
          type: 'number',
        },
        openInNewWindow: {
          type: 'boolean',
        },
      },
    },
  },
};

export const db = new Store<Profile>({
  schema,
  cwd: `${
    import.meta.env.DEV ? app.getAppPath() : app.getPath('userData')
  }/storage`,
  migrations: {},
});

export const getStoreValue = (_: IpcMainInvokeEvent, key: string) =>
  db.get(key);

export const setStoreValue = (
  _: IpcMainInvokeEvent,
  key: string,
  value: unknown,
) => db.set(key, value);

export function registerDatabaseHandlers() {
  ipcMain.handle('getStoreValue', getStoreValue);
  ipcMain.on('setStoreValue', setStoreValue);
}
