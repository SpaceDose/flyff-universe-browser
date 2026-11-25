import {type ElectronAPI} from '@electron-toolkit/preload';
import {type BrowserView, type BrowserWindow} from 'electron';
import {type API} from './api';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}

export type Profile = {
  window: Window;
  playfield: Playfield;
  settings: Settings;
  clients: Client[];
};

// biome-ignore lint/suspicious/noRedeclare: augments the global Window interface above, distinct from this type
export type Window = {
  width: number;
  height: number;
  x?: number;
  y?: number;
};

export type Playfield = {
  panels: Panel[];
  splitX: number;
  splitY: number;
  padding: number;
  navigationHeight: number;
  showNavigation: boolean;
  isFullscreen?: boolean;
};

export type Panel = {
  index: number;
  clientId?: string;
  active?: boolean;
};

export type Client = {
  id: string;
  name?: string;
  view?: BrowserView;
  isOpenInNewWindow?: boolean;
  isMuted?: boolean;
  window?: BrowserWindow;
};

export type Settings = {
  focusOnHover: boolean;
  openNavigationOnHover: boolean;
};
