import clsx from 'clsx';
import {type FC} from 'react';
import {type Panel} from '../../../../../preload/types';
import {hoverPanelColors, panelColors} from '../panel-colors';

type PanelSelect = {
  panels: Panel[];
  onClick?: (index: number) => void;
  mouseOverPanel?: number;
};

export const PanelSelect: FC<PanelSelect> = ({
  panels,
  onClick,
  mouseOverPanel,
}) => (
  <div className='grid w-24 grid-cols-2 gap-0.5'>
    {panels.map((panel) => (
      <button
        key={panel.index}
        onClick={() => {
          if (onClick) onClick(panel.index);
        }}
        className={clsx(
          'group flex items-center justify-center shadow',
          panels.length < 2 && 'col-span-2',
          panels.length % 2 && 'first:row-span-2',
          !onClick || mouseOverPanel === panel.index
            ? `${panelColors[panel.index]} cursor-default`
            : `bg-gray-darker ${hoverPanelColors[panel.index]}`,
          mouseOverPanel === panel.index && 'opacity-75',
        )}
      />
    ))}
  </div>
);
