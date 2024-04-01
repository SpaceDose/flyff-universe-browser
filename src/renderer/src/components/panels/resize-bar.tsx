import {type FC} from 'react';
import {type ClassNameValue, twMerge} from 'tailwind-merge';

type ResizeBarProps = {
  className: ClassNameValue;
  style: React.CSSProperties;
  onMouseDownCapture: () => void;
};

export const ResizeBar: FC<ResizeBarProps> = ({
  className,
  style,
  onMouseDownCapture,
}) => (
  <div
    draggable
    style={style}
    className={twMerge(
      'absolute top-0 flex select-none items-center justify-center bg-black',
      className,
    )}
    onMouseDownCapture={(e) => {
      e.preventDefault();
      onMouseDownCapture();
    }}
  />
);
