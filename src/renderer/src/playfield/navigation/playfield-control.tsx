import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';
import {type FC} from 'react';
import {twMerge} from 'tailwind-merge';
import {type Panel} from '../../../../preload/types';
import {PanelSelect} from './client-navigation/panel-select';

type PlayfieldControlProps = {
  panels: Panel[];
};

export const PlayfieldControl: FC<PlayfieldControlProps> = ({panels}) => {
  const addPanel = () => {
    window.api.addPanel();
  };

  const removePanel = () => {
    window.api.removePanel();
  };

  return (
    <div className='flex h-full select-none flex-col items-center justify-center pb-3'>
      <p className='self-start text-sm'>Panels</p>

      <div
        className='flex grow'
        onWheel={(e) => (e.deltaY < 0 ? addPanel() : removePanel())}
      >
        <PanelSelect panels={panels} />

        <div className='ml-0.5 flex flex-col self-center'>
          <button
            onClick={addPanel}
            className={twMerge(
              'hover:bg-gray-500 rounded-full p-0.5',
              panels.length === 4 && 'cursor-default opacity-25',
            )}
          >
            <ChevronUpIcon className='w-3' />
          </button>
          <button
            onClick={removePanel}
            className={twMerge(
              'hover:bg-gray-500 rounded-full p-0.5',
              panels.length === 1 && 'cursor-default opacity-25',
            )}
          >
            <ChevronDownIcon className='w-3' />
          </button>
        </div>
      </div>
    </div>
  );
};
