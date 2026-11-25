import {type FC, useEffect} from 'react';
import {Outlet} from 'react-router';
import Github from '../assets/github.svg';
import {ConfirmContextProvider} from '../components/confirmation-dialog/confirm-context-provider';
import {ConfirmationDialog} from '../components/confirmation-dialog/confirmation-dialog';
import {SettingsLink} from './settings-link';

export const Settings: FC = () => {
  useEffect(() => window.api.hideAllViews(), []);

  return (
    <ConfirmContextProvider>
      <div className='absolute top-0 left-0 z-50 flex h-screen w-screen justify-center overflow-hidden text-white'>
        <div className='bg-gray-darker flex shrink-0 grow flex-col items-end gap-2 overflow-y-auto px-5 pt-28 pb-12'>
          <SettingsLink label='General' to='general' />
          <SettingsLink label='Clients' to='clients' />
          <SettingsLink label='Changelog' to='changelog' />

          <div className='mt-auto'>
            <a
              href='https://github.com/SpaceDose/flyff-universe-browser'
              target='_blank'
              className='hover:bg-gray-lighter'
              rel='noreferrer'
            >
              <img
                src={Github}
                alt='GitHub'
                className='hover:bg-gray-light size-8 rounded-full p-1'
              />
            </a>
          </div>
        </div>

        <Outlet />

        <ConfirmationDialog />
      </div>
    </ConfirmContextProvider>
  );
};
