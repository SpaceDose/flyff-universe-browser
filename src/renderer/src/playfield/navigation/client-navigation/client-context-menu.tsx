import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import Cog6ToothIcon from '@heroicons/react/24/solid/Cog6ToothIcon';
import SpeakerWaveIcon from '@heroicons/react/24/solid/SpeakerWaveIcon';
import SpeakerXMarkIcon from '@heroicons/react/24/solid/SpeakerXMarkIcon';
import ArrowPathIcon from '@heroicons/react/24/solid/XMarkIcon';
import {type ReactNode, type FC} from 'react';
import {useNavigate} from 'react-router-dom';
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
      className='size-5 rounded-full p-px hover:bg-gray-lighter'
      onClick={onClick}
    >
      {icon}
    </button>
  ) : (
    <div className='size-5' />
  );

const Col: FC<{children?: ReactNode}> = ({children}) => (
  <div className='flex flex-col items-center justify-between'>{children}</div>
);

export const ClientContextMenu: FC<ClientContextMenuProps> = ({client}) => {
  const navigate = useNavigate();

  return (
    <div className='grid size-full grid-cols-4 rounded bg-gray-darker px-0.5 py-1'>
      <Col>
        <MenuButton
          onClick={() => window.api.openWindow(client.id)}
          icon={<ArrowTopRightOnSquareIcon />}
          hide={client.isOpenInNewWindow}
        />
        <MenuButton
          onClick={() => window.api.toggleMuted(client.id)}
          icon={client.isMuted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
        />
      </Col>
      <Col />
      <Col />
      <Col>
        <MenuButton
          onClick={() => window.api.closeClient(client.id)}
          icon={<ArrowPathIcon />}
        />
        <MenuButton
          onClick={() => navigate('/settings/clients')}
          icon={<Cog6ToothIcon />}
        />
      </Col>
    </div>
  );
};
