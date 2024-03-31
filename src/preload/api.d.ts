export interface API {
  // database
  getStoreValue: (key: string) => Promise<unknown>;
  setStoreValue: (key: string, value: unknown) => void;

  //panel
  getPanelSettings: () => Promise<PanelSettings>;
  setPanelSettings: (settings: PanelSettings) => Promise<boolean>;

  addPanel: () => void;
  removePanel: () => void;
  setSplits: (x?: number, y?: number) => Promise<boolean>;

  // client
  getClients: () => Promise<Client[]>;
  addClient: () => void;
  removeClient: (clientId: string) => void;
  openClient: (clientId: string, panelIndex: number) => void;
  moveClientLeft: (clientId: string) => void;
  moveClientRight: (clientId: string) => void;

  // update frontend
  pullPanelSettingsUpdate: () => Promise<boolean>;
  pushPanelSettingsUpdate: (
    callback: (event: unknown, settings: PanelSettings) => void,
  ) => () => void;
  pushClientsUpdate: (
    callback: (event: unknown, clients: Client[]) => void,
  ) => () => void;

  // handle app updates
  installUpdate: () => void;
  pushUpdateAvailable: (callback: (event: unknown) => void) => () => void;
}
