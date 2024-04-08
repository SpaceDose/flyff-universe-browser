import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import {Fragment, type FC, type ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';

type SettingsPageProps = {
  title: string;
  options: ReactNode[];
};

export const SettingsPage: FC<SettingsPageProps> = ({title, options}) => {
  const navigate = useNavigate();

  return (
    <div className='bg-gray-dark flex flex-col p-8'>
      <div className='flex justify-between items-center font-bold'>
        <h1 className='text-xl'>{title}</h1>

        <button
          type='button'
          onClick={() => navigate('/')}
          className='rounded-full p-px hover:bg-gray-light'
        >
          <XCircleIcon className='w-8' />
        </button>
      </div>

      <div className='flex-col flex pt-12 gap-8'>
        {options.map((option, index) => (
          <>
            {option}
            {index !== options.length && <hr />}
          </>
        ))}
      </div>
    </div>
  );
};
