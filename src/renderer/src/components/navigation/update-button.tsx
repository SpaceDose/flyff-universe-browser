import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {type FC, useContext} from 'react';
import {UpdateAvailableProviderContext} from '../provider/update-available-provider';

export const UpdateButton: FC = () => {
  const updateAvailable = useContext(UpdateAvailableProviderContext);

  if (!updateAvailable) return null;

  return (
    <button
      className='ml-auto flex-col p-2 hover:bg-gray-light flex items-center justify-center text-xs'
      onClick={() => {
        window.api.installUpdate();
      }}
    >
      <div className='relative'>
        <ArrowPathIcon className='w-5 mb-1.5' />
        <div className='absolute rounded-full bg-blue-light size-2 -top-1 -right-1 animate-ping' />
        <div className='absolute rounded-full bg-blue-light size-2 -top-1 -right-1' />
      </div>
      <p>Update available!</p>
      <p>Restart now!</p>
    </button>
  );
};
