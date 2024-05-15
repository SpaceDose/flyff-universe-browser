import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';
import Cog6ToothIcon from '@heroicons/react/24/solid/Cog6ToothIcon';
import {useContext, type FC, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useClients} from '../../provider/clients-provider';
import {PlayfieldContext} from '../../provider/playfield-provider';
import {useSettings} from '../../provider/settings-provider';
import {ClientNavigation} from './client-navigation/client-navigation';
import {NavigationDivider} from './navigation-divider';
import {PlayfieldControl} from './playfield-control';
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
      className='flex w-full flex-col overflow-hidden bg-gray'
      onMouseEnter={() => {
        if (enableOpenOnHover) setShowNavigation(true);
      }}
      onMouseLeave={() => {
        if (enableOpenOnHover) setShowNavigation(false);
      }}
      style={{height: showNavigation ? navigationHeight : padding}}
    >
      <button
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
