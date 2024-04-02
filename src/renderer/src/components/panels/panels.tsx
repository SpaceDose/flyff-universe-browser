import {type FC, useState, useCallback, useEffect, useContext} from 'react';
import {PanelSettingsContext} from '../provider/panel-settings-provider';
import {PanelBackground} from './panel-background';
import {ResizeBar} from './resize-bar';

const {min, max} = Math;

export type Cursor = {
  deltaX: number;
  deltaY: number;
};

export const Panels: FC = () => {
  const {splitX, splitY, padding, showNavigation, navigationHeight, panels} =
    useContext(PanelSettingsContext);

  const [isDragging, setIsDragging] = useState<{x?: boolean; y?: boolean}>({});
  const [cursor, setCursor] = useState<Cursor>({deltaX: 0, deltaY: 0});
  const [{width, height}, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({width: 0, height: 0});
  const pxSplitX = splitX * width;
  const pxSplitY = splitY * height;

  const minMaxDelta = useCallback(
    (axis: 'x' | 'y', value?: number) => {
      const bounds = {lower: 0, upper: 0};

      switch (axis) {
        case 'x':
          bounds.lower = pxSplitX - padding / 2;
          bounds.upper = width - bounds.lower - padding;

          return max(min(value ?? cursor.deltaX, bounds.upper), -bounds.lower);
        case 'y':
          bounds.lower = pxSplitY - padding / 2;
          bounds.upper = height - bounds.lower - padding;

          return max(min(value ?? cursor.deltaY, bounds.upper), -bounds.lower);
      }
    },
    [pxSplitX, padding, width, cursor.deltaX, cursor.deltaY, pxSplitY, height],
  );

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (isDragging.x || isDragging.y) {
        const dx = isDragging.x ? e.clientX - pxSplitX : undefined;
        const dy = isDragging.y ? e.clientY - pxSplitY : undefined;
        const newSplitX = dx
          ? (pxSplitX + minMaxDelta('x', dx)) / width
          : undefined;
        const newSplitY = dy
          ? (pxSplitY + minMaxDelta('y', dy)) / height
          : undefined;

        window.api.setSplits(newSplitX, newSplitY).then(() => {
          const newCursor: Cursor = {...cursor};
          if (dx !== undefined) newCursor.deltaX = dx;
          if (dy !== undefined) newCursor.deltaY = dy;
          setCursor(newCursor);
        });
      }
    };
    window.addEventListener('mousemove', mouseMove);

    const onMouseUp = () => {
      window.api.pullPanelSettingsUpdate().then(() =>
        setCursor({
          deltaX: 0,
          deltaY: 0,
        }),
      );
      setIsDragging({});
    };
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [cursor, minMaxDelta, width, height, pxSplitX, pxSplitY, isDragging]);

  useEffect(() => {
    const resize = () =>
      setWindowSize({
        width: window.innerWidth,
        height:
          window.innerHeight - (showNavigation ? navigationHeight : padding),
      });
    resize();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [navigationHeight, padding, showNavigation]);

  return (
    <div className='text-green-500 relative w-full grow overflow-hidden'>
      <PanelBackground />

      {panels.length > 1 && (
        <ResizeBar
          className='hover:cursor-ew-resize'
          style={{
            width: padding,
            height,
            left: pxSplitX + minMaxDelta('x') - padding / 2,
          }}
          onMouseDownCapture={() => setIsDragging({x: true})}
        />
      )}
      {panels.length > 2 && (
        <>
          <ResizeBar
            className='hover:cursor-ns-resize'
            style={{
              height: padding,
              width:
                panels.length === 3
                  ? width - pxSplitX - minMaxDelta('x')
                  : width,
              top: pxSplitY + minMaxDelta('y') - padding / 2,
              left: panels.length === 3 ? pxSplitX + minMaxDelta('x') : 0,
            }}
            onMouseDownCapture={() => setIsDragging({y: true})}
          />
          <ResizeBar
            className='hover:cursor-move'
            style={{
              height: padding,
              width: padding,
              top: pxSplitY + minMaxDelta('y') - padding / 2,
              left: pxSplitX + minMaxDelta('x') - padding / 2,
            }}
            onMouseDownCapture={() => setIsDragging({x: true, y: true})}
          />
        </>
      )}
    </div>
  );
};
