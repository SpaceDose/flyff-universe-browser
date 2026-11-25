import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import {type FC, Fragment, type ReactNode} from 'react';
import {useNavigate} from 'react-router';

type SettingsPageProps = {
  title: string;
  description?: string;
  options: ReactNode[];
};

export const SettingsPage: FC<SettingsPageProps> = ({
  title,
  description,
  options,
}) => {
  const navigate = useNavigate();

  return (
    <OverlayScrollbarsComponent className='bg-gray-dark flex grow flex-col p-8'>
      <div className='flex w-lg flex-col'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold'>{title}</h1>
            {description && (
              <h2 className='text-sm text-white/75'>{description}</h2>
            )}
          </div>

          <button
            type='button'
            onClick={() => navigate('/')}
            className='hover:bg-gray-light ml-4 rounded-full p-px'
          >
            <XCircleIcon className='w-8' />
          </button>
        </div>

        <div className='flex flex-col gap-8 pt-12'>
          {options.map((option, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list, never reordered
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
