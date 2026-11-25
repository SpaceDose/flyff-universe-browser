import {type FC, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import type {Client, Playfield} from '../../../../../preload/types';
import {transparentPanelColors} from '../panel-colors';
import {ClientContextMenu} from './client-context-menu';
import {PanelSelect} from './panel-select';

type ClientTileProps = {
  client: Client;
  panelSettings: Playfield;
};

export const ClientTile: FC<ClientTileProps> = ({client, panelSettings}) => {
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const {id, isOpenInNewWindow, name} = client;
  const activePanel = panelSettings.panels.find(
    (panel) => panel.clientId === client.id,
  );

  return (
    <div
      key={id}
      onBlur={() => setShowContextMenu(false)}
      onMouseLeave={() => setShowContextMenu(false)}
      onMouseDown={(e) => {
        if (e.button === 2) setShowContextMenu(!showContextMenu);
      }}
      className='group w-24 shrink-0 select-none'
    >
      {showContextMenu ? (
        <ClientContextMenu client={client} />
      ) : (
        <>
          <button
            type='button'
            className={twMerge(
              'bg-gray-darker flex size-full cursor-pointer items-end rounded-sm border border-transparent px-1.5 py-1 text-left shadow',
              activePanel &&
                `${transparentPanelColors[activePanel.index]} border-white hover:border-transparent`,
              isOpenInNewWindow
                ? 'hover:border-red bg-black'
                : 'group-hover:hidden',
            )}
            onClick={() => window.api.closeWindow(client.id)}
          >
            <p className='truncate group-hover:hidden'>{name ?? 'Unnamed'}</p>
            <p className='hidden group-hover:flex'>Close Window</p>
          </button>

          <div
            className={twMerge(
              'hidden h-full',
              !isOpenInNewWindow && 'group-hover:flex',
            )}
          >
            <PanelSelect
              panels={panelSettings.panels}
              onClick={(index) => window.api.openClient(id, index)}
              mouseOverPanel={activePanel?.index}
            />
          </div>
        </>
      )}
    </div>
  );
};
