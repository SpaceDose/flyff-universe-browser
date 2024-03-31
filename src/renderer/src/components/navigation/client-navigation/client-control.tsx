import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import clsx from 'clsx';
import {type FC, useState} from 'react';
import {type Client, type PanelSettings} from 'src/preload/types';
import {panelColors} from '../panel-colors';
import {PanelSelect} from './panel-select';

type ClientControlProps = {
  client: Client;
  panelSettings: PanelSettings;
};

export const ClientControl: FC<ClientControlProps> = ({
  client,
  panelSettings,
}) => {
  const [control, setControl] = useState<boolean>(false);
  const panel = panelSettings.panels.find(
    (panel) => panel.clientId === client.id,
  );

  return (
    <div
      key={client.id}
      onMouseLeave={() => setControl(false)}
      onMouseDown={(e) => {
        if (e.button == 2) setControl(true);
      }}
      className={clsx(
        'hover:shadow-none group flex w-24 select-none flex-col justify-between shadow hover:bg-transparent',
        panel ? panelColors[panel.index] : 'bg-gray-darker',
      )}
    >
      {control ? (
        <div className='flex h-full flex-col bg-gray-dark px-1.5 py-1'>
          <div className='flex w-full justify-center'>
            <button onClick={() => window.api.moveClientLeft(client.id)}>
              <ChevronLeftIcon className='w-5' />
            </button>
            <button onClick={() => window.api.moveClientRight(client.id)}>
              <ChevronRightIcon className='w-5' />
            </button>
          </div>
          <button
            onClick={() => window.api.removeClient(client.id)}
            className='ml-auto mt-auto'
          >
            <TrashIcon className='w-5' />
          </button>
        </div>
      ) : (
        <>
          <div className='mt-auto flex w-full justify-between px-1.5 py-1 group-hover:hidden'>
            <p className='truncate drop-shadow'>
              {client.character ?? `Panel ${client.order}`}
            </p>
          </div>
          <div className='hidden h-full group-hover:flex'>
            <PanelSelect
              panels={panelSettings.panels}
              onClick={(index) => window.api.openClient(client.id, index)}
              mouseOverPanel={panel?.index}
            />
          </div>
        </>
      )}
    </div>
  );
};