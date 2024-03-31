import clsx, {type ClassValue} from 'clsx';
import {type FC} from 'react';

type ResizeBarProps = {
  className: ClassValue;
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
    className={clsx(
      'absolute top-0 flex select-none items-center justify-center bg-black',
      className,
    )}
    onMouseDownCapture={(e) => {
      e.preventDefault();
      onMouseDownCapture();
    }}
  />
);
