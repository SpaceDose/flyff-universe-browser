import {type FC, useEffect} from 'react';
import {Gutter} from './gutter/gutter';
import {Navigation} from './navigation/navigation';

export const Playfield: FC = () => {
  useEffect(() => window.api.showAllViews(), []);

  return (
    <div className='bg-blue-lighter flex h-screen flex-col text-white'>
      <Gutter />
      <Navigation />
    </div>
  );
};
