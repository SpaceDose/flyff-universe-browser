import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {Spinner} from '@radix-ui/themes';
import clsx from 'clsx';
import {type FC, useContext} from 'react';
import {UpdateStatusContext} from '../provider/update-status-provider';

export const UpdateButton: FC = () => {
  const {downloading, readyToInstall} = useContext(UpdateStatusContext);

  if (!downloading && !readyToInstall) return null;

  return (
    <button
      className={clsx(
        'ml-auto w-36 flex-col p-2 flex items-center justify-center text-xs gap-px',
        readyToInstall ? 'hover:bg-gray-light' : 'cursor-default',
      )}
      onClick={() => {
        if (readyToInstall) window.api.installUpdate();
      }}
    >
      {downloading && (
        <>
          <Spinner className='mb-2' />
          <p>Update available</p>
          <p>Download in progress</p>
        </>
      )}

      {readyToInstall && (
        <>
          <div className='relative'>
            <ArrowPathIcon className='w-5 mb-1.5' />
            <div className='absolute rounded-full bg-blue-light size-2 -top-1 -right-1 animate-ping' />
            <div className='absolute rounded-full bg-blue-light size-2 -top-1 -right-1' />
          </div>
          <p>Download ready</p>
          <p>Restart now!</p>
        </>
      )}
    </button>
  );
};
