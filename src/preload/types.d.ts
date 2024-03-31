import {type ElectronAPI} from '@electron-toolkit/preload';
import {type BrowserWindow, type BrowserView} from 'electron';
import {type API} from './api';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}

export type Profile = {
  windowSettings: WindowSettings;
  panelSettings: PanelSettings;
  clients: Client[];
};

export type WindowSettings = {
  width: number;
  height: number;
  x?: number;
  y?: number;
};

export type PanelSettings = {
  panels: Panel[];
  splitX: number;
  splitY: number;
  padding: number;
  navigationHeight: number;
  showNavigation: boolean;
};

export type Panel = {
  index: number;
  clientId?: string;
  active?: boolean;
};

export type Client = {
  id: string;
  character?: string;
  view?: BrowserView;
  order: number;
  openInNewWindow?: boolean;
  window?: BrowserWindow;
};
