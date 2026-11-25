import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import type {FC, ReactNode} from 'react';

// Shown on hover and on keyboard focus.
export const InfoTooltip: FC<{children: ReactNode}> = ({children}) => (
  <span className='group/tooltip relative inline-flex'>
    <button
      type='button'
      aria-label='More information'
      className='cursor-help opacity-50 hover:opacity-100 focus:opacity-100'
    >
      <InformationCircleIcon className='w-4' />
    </button>
    <span
      role='tooltip'
      className='pointer-events-none invisible absolute top-full left-1/2 z-10 mt-2 w-64 -translate-x-1/2 rounded-sm bg-black px-3 py-2 text-xs leading-relaxed font-normal tracking-normal text-white/90 normal-case opacity-0 shadow transition-opacity group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:opacity-100'
    >
      {children}
    </span>
  </span>
);
