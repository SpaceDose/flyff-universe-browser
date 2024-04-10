import {useEffect, type FC} from 'react';
import {Outlet} from 'react-router-dom';
import Github from '../assets/github.svg';
import {SettingsLink} from './settings-link';

export const Settings: FC = () => {
  useEffect(() => window.api.hideAllViews(), []);

  return (
    <div className='absolute left-0 top-0 z-50 flex h-screen w-screen justify-center overflow-hidden text-white'>
      <div className='flex shrink-0 grow flex-col items-end gap-2 overflow-y-auto bg-gray-darker px-5 pb-12 pt-28'>
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
              className='size-8 rounded-full p-1 hover:bg-gray-light'
            />
          </a>
        </div>
      </div>

      <Outlet />
    </div>
  );
};
