import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';
import Cog6ToothIcon from '@heroicons/react/24/solid/Cog6ToothIcon';
import {type FC, useContext, useState} from 'react';
import {useNavigate} from 'react-router';
import {useClients} from '../../provider/clients-provider';
import {PlayfieldContext} from '../../provider/playfield-provider';
import {useSettings} from '../../provider/settings-provider';
import {ClientNavigation} from './client-navigation/client-navigation';
import {NavigationDivider} from './navigation-divider';
import {PlayfieldControl} from './playfield-control';
import {StatusIndicator} from './status-indicator';
import {UpdateButton} from './update-button';

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const playfield = useContext(PlayfieldContext);
  const {showNavigation, padding, navigationHeight, isFullscreen, panels} =
    playfield;
  const {clients} = useClients();
  const settings = useSettings();

  const [pinnedNavigation, setPinnedNavigation] = useState<boolean>(false);

  const enableOpenOnHover =
    isFullscreen && !pinnedNavigation && settings?.openNavigationOnHover;

  const setShowNavigation = (showNavigation: boolean) => {
    window.api.setPlayfield({...playfield, showNavigation});
  };

  return (
    <div
      className='bg-gray flex w-full flex-col overflow-hidden'
      onMouseEnter={() => {
        if (enableOpenOnHover) setShowNavigation(true);
      }}
      onMouseLeave={() => {
        if (enableOpenOnHover) setShowNavigation(false);
      }}
      style={{height: showNavigation ? navigationHeight : padding}}
    >
      <button
        type='button'
        onClick={() => {
          if (enableOpenOnHover) {
            setPinnedNavigation(!pinnedNavigation);
          } else {
            setPinnedNavigation(!showNavigation);
            setShowNavigation(!showNavigation);
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
          <PlayfieldControl panels={panels} />
          <NavigationDivider />
          <ClientNavigation clients={clients} playfield={playfield} />
          <div className='ml-auto flex items-center gap-4 pl-1'>
            <StatusIndicator />
            <button
              type='button'
              className='hover:bg-gray-lighter rounded-full p-px'
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
