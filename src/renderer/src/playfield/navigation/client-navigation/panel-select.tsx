import {type FC} from 'react';
import {twMerge} from 'tailwind-merge';
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
      className={twMerge(
        'grid w-24 grid-cols-2 gap-1',
        usedAsPanelControl && 'gap-0.5',
      )}
    >
      {panels.map((panel) => (
        <button
          key={panel.index}
          onClick={() => {
            if (onClick) onClick(panel.index);
          }}
          className={twMerge(
            'group border border-transparent bg-gray-darker shadow',
            usedAsPanelControl ? 'cursor-default' : 'rounded',
            panels.length < 2 && 'col-span-2',
            panels.length % 2 && 'first:row-span-2',
            usedAsPanelControl || mouseOverPanel === panel.index
              ? panelColors[panel.index]
              : `${hoverPanelColors[panel.index]} hover:border-white`,
            mouseOverPanel === panel.index && 'bg-opacity-75 hover:border-red',
          )}
        />
      ))}
    </div>
  );
};
