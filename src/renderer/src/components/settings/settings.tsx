import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import {type FC, useContext} from 'react';
import {SettingsContext} from '../provider/settings-provider';

export const Settings: FC = () => {
  const settings = useContext(SettingsContext);

  if (!settings?.open) return null;

  return (
    <div className='flex absolute top-0 left-0 justify-center w-screen h-screen bg-gray z-50'>
      <div className='bg-gray-darker grow' />
      <div className='max-w-4xl flex w-full'>
        <div className='w-1/3 bg-gray-darker' />
        <div className='w-2/3 bg-gray-dark flex flex-col p-8'>
          <div className='flex justify-between items-center font-bold'>
            <h1 className='text-lg'>Settings</h1>
            <button
              onClick={settings.closeSettings}
              className='rounded-full p-px hover:bg-gray-light'
            >
              <XCircleIcon className='w-6' />
            </button>
          </div>
        </div>
      </div>
      <div className='bg-gray-dark grow' />
    </div>
  );
};
