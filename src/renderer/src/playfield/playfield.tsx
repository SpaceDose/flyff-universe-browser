import {type FC, useEffect} from 'react';
import {Gutter} from './gutter/gutter';
import {Navigation} from './navigation/navigation';

export const Playfield: FC = () => {
  useEffect(() => window.api.showAllViews(), []);

  return (
    <div className='flex h-screen flex-col bg-blue-lighter text-white'>
      <Gutter />
      <Navigation />
    </div>
  );
};
