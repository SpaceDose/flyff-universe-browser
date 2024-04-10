import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {type FC} from 'react';
import {type Client, type Playfield} from '../../../../../preload/types';
import {ClientTile} from './client-tile';

type ClientNavigationProps = {
  clients: Client[];
  playfield: Playfield;
};

export const ClientNavigation: FC<ClientNavigationProps> = ({
  clients,
  playfield,
}) => (
  <div className='flex h-full gap-2'>
    {clients.map((client) => (
      <ClientTile key={client.id} client={client} panelSettings={playfield} />
    ))}
    <button
      onClick={() => window.api.addClient()}
      className='flex w-24 items-center justify-center rounded bg-gray-darker shadow hover:bg-gray-lighter'
    >
      <PlusIcon className='w-5' />
    </button>
  </div>
);
