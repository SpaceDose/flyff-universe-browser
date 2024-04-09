import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import {Fragment, type FC, type ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';

type SettingsPageProps = {
  title: string;
  options: ReactNode[];
};

export const SettingsPage: FC<SettingsPageProps> = ({title, options}) => {
  const navigate = useNavigate();

  return (
    <OverlayScrollbarsComponent className='flex grow flex-col bg-gray-dark p-8'>
      <div className='flex w-[32rem] flex-col'>
        <div className='flex items-center justify-between font-bold'>
          <h1 className='text-xl'>{title}</h1>

          <button
            type='button'
            onClick={() => navigate('/')}
            className='rounded-full p-px hover:bg-gray-light'
          >
            <XCircleIcon className='w-8' />
          </button>
        </div>

        <div className='flex flex-col gap-8 pt-12'>
          {options.map((option, index) => (
            <Fragment key={index}>
              {option}
              {index < options.length - 1 && (
                <hr className='border-gray-lighter' />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </OverlayScrollbarsComponent>
  );
};
