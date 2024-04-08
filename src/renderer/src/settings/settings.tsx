import {useEffect, type FC} from 'react';
import {Link, Outlet} from 'react-router-dom';

export const Settings: FC = () => {
  useEffect(() => window.api.hideAllViews(), []);

  return (
    <div className='flex text-white absolute top-0 left-0 justify-center w-screen h-screen bg-gray z-50'>
      <div className='bg-gray-darker grow' />

      <div className='max-w-3xl flex w-full'>
        <div className='w-1/4 min-w-48 bg-gray-darker px-4 py-28'>
          <Link to='./general' className='bg-gray px-2 py-1 w-full rounded'>
            General
          </Link>
        </div>

        <Outlet />
      </div>

      <div className='bg-gray-dark grow' />
    </div>
  );
};
