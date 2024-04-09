import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import {type FC, useContext} from 'react';
import {HashLoader} from 'react-spinners';
import {twMerge} from 'tailwind-merge';
import {UpdateStatusContext} from '../../provider/update-status-provider';

export const UpdateButton: FC = () => {
  const {downloading, readyToInstall} = useContext(UpdateStatusContext);

  if (!downloading && !readyToInstall) return null;

  return (
    <button
      className={twMerge(
        'flex w-36 flex-col items-center justify-center gap-px p-2 text-xs',
        readyToInstall ? 'hover:bg-gray-light' : 'cursor-default',
      )}
      onClick={() => {
        if (readyToInstall) window.api.installUpdate();
      }}
    >
      {downloading && (
        <>
          <HashLoader color='#fff' size={24} className='mb-2' />
          <p>Update available</p>
          <p>Download in progress</p>
        </>
      )}

      {readyToInstall && (
        <>
          <div className='relative'>
            <ArrowPathIcon className='mb-1.5 w-5' />
            <div className='absolute -right-1 -top-1 size-2 animate-ping rounded-full bg-blue-light' />
            <div className='absolute -right-1 -top-1 size-2 rounded-full bg-blue-light' />
          </div>
          <p>Download ready</p>
          <p>Restart now!</p>
        </>
      )}
    </button>
  );
};
