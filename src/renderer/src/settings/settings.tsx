import {useEffect, type FC} from 'react';
import {Outlet} from 'react-router-dom';
import {SettingsLink} from './settings-link';

export const Settings: FC = () => {
  useEffect(() => window.api.hideAllViews(), []);

  return (
    <div className='absolute left-0 top-0 z-50 flex h-screen w-screen justify-center overflow-hidden text-white'>
      <div className='flex shrink-0 grow flex-col items-end gap-2 overflow-y-auto bg-gray-darker px-5 py-28'>
        <SettingsLink label='General' to='general' />
        <SettingsLink label='Changelog' to='changelog' />
      </div>
      <Outlet />
    </div>
  );
};
