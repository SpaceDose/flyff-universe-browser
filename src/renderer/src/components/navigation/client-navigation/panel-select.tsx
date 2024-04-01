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
}) => {
  const usedAsPanelControl = !onClick;

  return (
    <div
      className={clsx(
        'grid w-24 grid-cols-2',
        usedAsPanelControl ? 'gap-0.5' : 'gap-1',
      )}
    >
      {panels.map((panel) => (
        <button
          key={panel.index}
          onClick={() => {
            if (onClick) onClick(panel.index);
          }}
          className={clsx(
            'group flex items-center justify-center shadow',
            !usedAsPanelControl && 'rounded',
            panels.length < 2 && 'col-span-2',
            panels.length % 2 && 'first:row-span-2',
            usedAsPanelControl || mouseOverPanel === panel.index
              ? `${panelColors[panel.index]} cursor-default`
              : `bg-gray-darker ${hoverPanelColors[panel.index]} border-white hover:border`,
            mouseOverPanel === panel.index && 'opacity-75',
          )}
        />
      ))}
    </div>
  );
};
