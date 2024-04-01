import clsx from 'clsx';
import {type FC, useState} from 'react';
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
  const activePanel = panelSettings.panels.find(
    (panel) => panel.clientId === client.id,
  );

  return (
    <div
      key={client.id}
      onBlur={() => setShowContextMenu(false)}
      onMouseLeave={() => setShowContextMenu(false)}
      onMouseDown={(e) => {
        if (e.button == 2) setShowContextMenu(true);
      }}
      className={clsx(
        'group flex w-24 select-none flex-col justify-between shadow border hover:bg-transparent rounded',
        activePanel &&
          `${panelColors[activePanel.index]} bg-opacity-75 border-white hover:border-transparent hover:shadow-none `,
        client.openInNewWindow
          ? 'bg-black hover:bg-black border-gray-lighter'
          : 'bg-gray-darker border-transparent',
      )}
    >
      {showContextMenu ? (
        <ClientContextMenu client={client} />
      ) : (
        <>
          <div
            className={clsx(
              'mt-auto flex w-full justify-between px-1.5 py-1',
              !client.openInNewWindow && 'group-hover:hidden',
            )}
          >
            <p className='truncate drop-shadow'>
              {client.character ?? `Panel ${client.order}`}
            </p>
          </div>

          <div
            className={clsx(
              'hidden h-full',
              !client.openInNewWindow && 'group-hover:flex',
            )}
          >
            <PanelSelect
              panels={panelSettings.panels}
              onClick={(index) => window.api.openClient(client.id, index)}
              mouseOverPanel={activePanel?.index}
            />
          </div>
        </>
      )}
    </div>
  );
};
