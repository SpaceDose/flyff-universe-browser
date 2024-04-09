import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';
import Cog6ToothIcon from '@heroicons/react/24/solid/Cog6ToothIcon';
import {useContext, type FC, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ClientsContext} from '../../provider/clients-provider';
import {PlayfieldContext} from '../../provider/playfield-provider';
import {ClientNavigation} from './client-navigation/client-navigation';
import {NavigationDivider} from './navigation-divider';
import {PlayfieldControl} from './playfield-control';
import {UpdateButton} from './update-button';

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const panelSettings = useContext(PlayfieldContext);
  const clients = useContext(ClientsContext);

  const [pinnedNavigation, setPinnedNavigation] = useState<boolean>(false);

  const {showNavigation, padding, navigationHeight, isFullscreen} =
    panelSettings;

  const setShowNavigation = (showNavigation: boolean) => {
    window.api.setPlayfield({...panelSettings, showNavigation});
  };

  return (
    <div
      className='flex w-full flex-col overflow-hidden bg-gray'
      onMouseEnter={() => {
        if (isFullscreen && !pinnedNavigation) setShowNavigation(true);
      }}
      onMouseLeave={() => {
        if (isFullscreen && !pinnedNavigation) setShowNavigation(false);
      }}
      style={{height: showNavigation ? navigationHeight : padding}}
    >
      <button
        onClick={() => {
          if (isFullscreen) {
            setPinnedNavigation(!pinnedNavigation);
          } else {
            setPinnedNavigation(!panelSettings.showNavigation);
            setShowNavigation(!panelSettings.showNavigation);
          }
        }}
        className='flex w-full items-center justify-center bg-black'
        style={{height: padding}}
      >
        {!showNavigation || (isFullscreen && !pinnedNavigation) ? (
          <ChevronUpIcon className='h-3' />
        ) : (
          <ChevronDownIcon className='h-3' />
        )}
      </button>

      {showNavigation && (
        <div className='flex grow gap-4 px-4 py-2'>
          <PlayfieldControl panels={panelSettings.panels} />
          <NavigationDivider />
          <ClientNavigation clients={clients} panelSettings={panelSettings} />
          <div className='ml-auto flex items-center gap-4'>
            <button
              className='rounded-full p-px hover:bg-gray-lighter'
              onClick={() => navigate('/settings/general')}
            >
              <Cog6ToothIcon className='w-5' />
            </button>
            <UpdateButton />
          </div>
        </div>
      )}
    </div>
  );
};
