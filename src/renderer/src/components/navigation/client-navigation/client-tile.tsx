import {type FC, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {type Client, type PanelSettings} from '../../../../../preload/types';
import {panelColors} from '../panel-colors';
import {ClientContextMenu} from './client-context-menu';
import {PanelSelect} from './panel-select';

type ClientTileProps = {
  client: Client;
  panelSettings: PanelSettings;
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
              'flex size-full bg-gray-darker border-transparent border rounded text-left items-end shadow cursor-pointer px-1.5 py-1',
              activePanel &&
                `${panelColors[activePanel.index]} bg-opacity-75 border-white hover:border-transparent`,
              isOpenInNewWindow
                ? 'bg-black hover:border-red'
                : 'group-hover:hidden',
            )}
            onClick={() => window.api.closeWindow(client.id)}
          >
            <p className='flex group-hover:hidden'>
              {character ?? `Panel ${order}`}
            </p>
            <p className='group-hover:flex hidden'>Close Window</p>
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
