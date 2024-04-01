import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import {type FC} from 'react';
import {type Client} from '../../../../../preload/types';

type ClientContextMenuProps = {
  client: Client;
};

export const ClientContextMenu: FC<ClientContextMenuProps> = ({client}) => (
  <div className='flex h-full flex-col bg-gray-darker px-1.5 py-1'>
    <div className='flex w-full justify-between'>
      <button
        className='hover:scale-125'
        onClick={() => window.api.reloadClient(client.id)}
      >
        <ArrowPathIcon className='w-5' />
      </button>
      <div className='flex'>
        <button
          className='hover:scale-125'
          onClick={() => window.api.moveClientLeft(client.id)}
        >
          <ChevronLeftIcon className='w-5' />
        </button>
        <button
          className='hover:scale-125'
          onClick={() => window.api.moveClientRight(client.id)}
        >
          <ChevronRightIcon className='w-5' />
        </button>
      </div>
    </div>

    <div className='flex justify-between mt-auto'>
      {!client.openInNewWindow && (
        <button
          className='hover:scale-125'
          onClick={() => window.api.openClientInNewWindow(client.id)}
        >
          <ArrowTopRightOnSquareIcon className='w-5' />
        </button>
      )}
      <button
        className='ml-auto hover:scale-125'
        onClick={() => window.api.removeClient(client.id)}
      >
        <TrashIcon className='w-5' />
      </button>
    </div>
  </div>
);
