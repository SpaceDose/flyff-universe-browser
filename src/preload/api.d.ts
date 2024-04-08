import {type Playfield, type Client, type Settings} from './types';

export interface API {
  // database
  getStoreValue: (key: string) => Promise<unknown>;
  setStoreValue: (key: string, value: unknown) => void;

  //panel
  getPlayfield: () => Promise<Playfield>;
  setPlayfield: (playfield: Playfield) => Promise<boolean>;

  addPanel: () => void;
  removePanel: () => void;
  setSplits: (x?: number, y?: number) => Promise<boolean>;

  // client
  getClients: () => Promise<Client[]>;
  addClient: () => void;
  removeClient: (clientId: string) => void;
  openClient: (clientId: string, panelIndex: number) => void;
  openWindow: (clientId: string) => void;
  closeWindow: (clientId: string) => void;
  moveClientLeft: (clientId: string) => void;
  moveClientRight: (clientId: string) => void;
  reloadClient: (clientId: string) => void;
  toggleMuted: (clientId: string) => void;

  // settings
  getSettings: () => Promise<Settings>;
  setSettings: (settings: Settings) => void;
  hideAllViews: () => void;
  showAllViews: () => void;

  // update frontend
  pullPlayfieldUpdate: () => Promise<boolean>;
  pushPlayfieldUpdate: (
    callback: (event: unknown, playfield: Playfield) => void,
  ) => () => void;
  pushClientsUpdate: (
    callback: (event: unknown, clients: Client[]) => void,
  ) => () => void;
  pushSettingsUpdate: (
    callback: (event: unknown, settings: Settings) => void,
  ) => () => void;

  // handle app updates
  installUpdate: () => void;
  pushUpdateAvailable: (callback: (event: unknown) => void) => () => void;
  pushUpdateReadyToInstall: (callback: (event: unknown) => void) => () => void;
}
