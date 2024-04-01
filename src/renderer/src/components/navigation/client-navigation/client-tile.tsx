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
  const {id, openInNewWindow, character, order} = client;
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
      className={twMerge(
        'group flex w-24 select-none flex-col justify-between bg-gray-darker shadow border border-transparent hover:bg-transparent rounded hover:shadow-transparent',
        activePanel &&
          `${panelColors[activePanel.index]} bg-opacity-75 border-white/50 hover:border-transparent`,
        openInNewWindow && 'bg-black hover:bg-black',
      )}
    >
      {showContextMenu ? (
        <ClientContextMenu client={client} />
      ) : (
        <>
          <div
            className={twMerge(
              'mt-auto flex w-full justify-between px-1.5 py-1',
              !openInNewWindow && 'group-hover:hidden',
            )}
          >
            <p className='truncate drop-shadow'>
              {character ?? `Panel ${order}`}
            </p>
          </div>

          <div
            className={twMerge(
              'hidden h-full',
              !openInNewWindow && 'group-hover:flex',
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
