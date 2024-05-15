import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-react';
import {createRef, type FC} from 'react';
import {type Client, type Playfield} from '../../../../../preload/types';
import {ClientTile} from './client-tile';

type ClientNavigationProps = {
  clients: Client[];
  playfield: Playfield;
};

export const ClientNavigation: FC<ClientNavigationProps> = ({
  clients,
  playfield,
}) => {
  const ref = createRef<OverlayScrollbarsComponentRef<'div'>>();

  return (
    <div className='-mb-2 overflow-hidden'>
      <OverlayScrollbarsComponent
        ref={ref}
        className='h-full pb-3'
        onWheel={(e) => {
          const el = ref.current?.osInstance()?.elements().scrollOffsetElement;
          el?.scrollTo({
            left: el.scrollLeft + e.deltaY,
            behavior: 'instant',
          });
        }}
      >
        <div className='flex h-full gap-2'>
          {clients.map((client) => (
            <ClientTile
              key={client.id}
              client={client}
              panelSettings={playfield}
            />
          ))}
          <button
            onClick={() => window.api.addClient()}
            className='flex w-24 shrink-0 items-center justify-center rounded bg-gray-darker shadow hover:bg-gray-lighter'
          >
            <PlusIcon className='w-5' />
          </button>
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
};
