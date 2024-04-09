import {type FC, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {type Client, type Playfield} from '../../../../../preload/types';
import {panelColors} from '../panel-colors';
import {ClientContextMenu} from './client-context-menu';
import {PanelSelect} from './panel-select';

type ClientTileProps = {
  client: Client;
  panelSettings: Playfield;
};

export const ClientTile: FC<ClientTileProps> = ({client, panelSettings}) => {
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const {id, isOpenInNewWindow, character, order} = client;
  const activePanel = panelSettings.panels.find(
    (panel) => panel.clientId === client.id,
  );

  return (
    <div
      key={id}
      onBlur={() => setShowContextMenu(false)}
      onMouseLeave={() => setShowContextMenu(false)}
      onMouseDown={(e) => {
        if (e.button == 2) setShowContextMenu(true);
      }}
      className='group w-24 select-none'
    >
      {showContextMenu ? (
        <ClientContextMenu client={client} />
      ) : (
        <>
          <button
            className={twMerge(
              'flex size-full cursor-pointer items-end rounded border border-transparent bg-gray-darker px-1.5 py-1 text-left shadow',
              activePanel &&
                `${panelColors[activePanel.index]} border-white bg-opacity-75 hover:border-transparent`,
              isOpenInNewWindow
                ? 'bg-black hover:border-red'
                : 'group-hover:hidden',
            )}
            onClick={() => window.api.closeWindow(client.id)}
          >
            <p className='truncate group-hover:hidden'>
              {character ?? `Panel ${order}`}
            </p>
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
