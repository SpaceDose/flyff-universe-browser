import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import SpeakerWaveIcon from '@heroicons/react/24/solid/SpeakerWaveIcon';
import SpeakerXMarkIcon from '@heroicons/react/24/solid/SpeakerXMarkIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import {type ReactNode, type FC} from 'react';
import {type Client} from '../../../../../preload/types';

type ClientContextMenuProps = {
  client: Client;
};

const MenuButton: FC<{
  icon: ReactNode;
  onClick: () => void;
  hide?: boolean;
}> = ({icon, onClick, hide}) =>
  !hide ? (
    <button
      className='w-5 rounded-full p-px hover:bg-gray-lighter'
      onClick={onClick}
    >
      {icon}
    </button>
  ) : (
    <div className='h-5' />
  );

const Col: FC<{children?: ReactNode}> = ({children}) => (
  <div className='flex flex-col justify-between'>{children}</div>
);

export const ClientContextMenu: FC<ClientContextMenuProps> = ({client}) => (
  <div className='grid h-full grid-cols-4 bg-gray-darker px-1.5 py-1'>
    <Col>
      <MenuButton
        onClick={() => window.api.reloadClient(client.id)}
        icon={<ArrowPathIcon />}
      />
      <MenuButton
        onClick={() => window.api.toggleMuted(client.id)}
        icon={client.isMuted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
      />
      <MenuButton
        onClick={() => window.api.openWindow(client.id)}
        icon={<ArrowTopRightOnSquareIcon />}
        hide={client.isOpenInNewWindow}
      />
    </Col>
    <Col />
    <Col>
      <MenuButton
        onClick={() => window.api.moveClientLeft(client.id)}
        icon={<ChevronLeftIcon />}
      />
    </Col>
    <Col>
      <MenuButton
        onClick={() => window.api.moveClientRight(client.id)}
        icon={<ChevronRightIcon />}
      />
      <MenuButton
        onClick={() => window.api.removeClient(client.id)}
        icon={<TrashIcon />}
      />
    </Col>
  </div>
);
