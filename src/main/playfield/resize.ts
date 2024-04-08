import {win} from '..';
import {clients} from '../clients';
import {playfield} from './panels';

const {floor, ceil} = Math;

const getClientViewFromPanel = (index: number) =>
  clients.find(
    (c) => c.id === playfield.panels.find((p) => p.index === index)?.clientId,
  )?.view;

const ws = {
  width: 0,
  height: 0,
  padding: 0,
};

const getLeftWidth = () => ceil(playfield.splitX * ws.width - ws.padding);
const getRightWidth = () =>
  ceil(ws.width - playfield.splitX * ws.width - ws.padding);

const getTopHeight = () => ceil(playfield.splitY * ws.height - ws.padding);
const getBottomHeight = () =>
  ceil(ws.height - playfield.splitY * ws.height - ws.padding);

export const resizePanels = () => {
  if (!win) throw Error('win is not initialized...');

  const bounds = win.getContentBounds();
  ws.height = floor(
    bounds.height -
      (playfield.showNavigation
        ? playfield.navigationHeight
        : playfield.padding),
  );
  ws.width = bounds.width;
  ws.padding = floor(playfield.padding / 2);

  const activePanels = playfield.panels.filter((panel) => panel.active);
  switch (activePanels.length) {
    case 0:
      break;
    case 1:
      getClientViewFromPanel(0)?.setBounds({
        x: 0,
        y: 0,
        width: ws.width,
        height: ws.height,
      });
      break;
    case 2:
      getClientViewFromPanel(0)?.setBounds({
        x: 0,
        y: 0,
        width: getLeftWidth(),
        height: ws.height,
      });
      getClientViewFromPanel(1)?.setBounds({
        x: ws.width - getRightWidth(),
        y: 0,
        width: getRightWidth(),
        height: ws.height,
      });
      break;
    case 3:
      getClientViewFromPanel(0)?.setBounds({
        x: 0,
        y: 0,
        width: getLeftWidth(),
        height: ws.height,
      });
      getClientViewFromPanel(1)?.setBounds({
        x: ws.width - getRightWidth(),
        y: 0,
        width: getRightWidth(),
        height: getTopHeight(),
      });
      getClientViewFromPanel(2)?.setBounds({
        x: ws.width - getRightWidth(),
        y: ws.height - getBottomHeight(),
        width: getRightWidth(),
        height: getBottomHeight(),
      });
      break;
    default:
      getClientViewFromPanel(0)?.setBounds({
        x: 0,
        y: 0,
        width: getLeftWidth(),
        height: getTopHeight(),
      });
      getClientViewFromPanel(1)?.setBounds({
        x: ws.width - getRightWidth(),
        y: 0,
        width: getRightWidth(),
        height: getTopHeight(),
      });
      getClientViewFromPanel(2)?.setBounds({
        x: 0,
        y: ws.height - getBottomHeight(),
        width: getLeftWidth(),
        height: getBottomHeight(),
      });
      getClientViewFromPanel(3)?.setBounds({
        x: ws.width - getRightWidth(),
        y: ws.height - getBottomHeight(),
        width: getRightWidth(),
        height: getBottomHeight(),
      });
  }
};
