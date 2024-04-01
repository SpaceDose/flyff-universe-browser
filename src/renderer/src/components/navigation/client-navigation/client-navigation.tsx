import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {type FC} from 'react';
import {type Client, type PanelSettings} from '../../../../../preload/types';
import {ClientTile} from './client-tile';

type ClientNavigationProps = {
  clients: Client[];
  panelSettings: PanelSettings;
};

export const ClientNavigation: FC<ClientNavigationProps> = ({
  clients,
  panelSettings,
}) => (
  <div className='flex h-full gap-2'>
    {clients
      .sort((a, b) => a.order - b.order)
      .map((client) => (
        <ClientTile
          key={client.id}
          client={client}
          panelSettings={panelSettings}
        />
      ))}
    <button
      onClick={() => window.api.addClient()}
      className='flex w-24 items-center justify-center bg-gray-darker shadow hover:bg-gray-lighter'
    >
      <PlusIcon className='w-5' />
    </button>
  </div>
);
