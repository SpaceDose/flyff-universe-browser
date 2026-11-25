import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import SpeakerWaveIcon from '@heroicons/react/24/solid/SpeakerWaveIcon';
import SpeakerXMarkIcon from '@heroicons/react/24/solid/SpeakerXMarkIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import type {FC} from 'react';
import {useConfirm} from '../../components/confirmation-dialog/useConfirm';
import {useClients} from '../../provider/clients-provider';
import {ClientHotkeys} from './client-hotkeys';

export const ClientList: FC = () => {
  const {clients, setClients} = useClients();
  const {confirm} = useConfirm();

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newOrderedClients = [...clients];
    const [removed] = newOrderedClients.splice(result.source.index, 1);
    newOrderedClients.splice(result.destination.index, 0, removed);
    setClients(newOrderedClients);
    window.api.reorderClients(newOrderedClients);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {clients.map((client, index) => (
              <Draggable key={client.id} draggableId={client.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className='group border-blue-lighter bg-gray-light mb-3 flex flex-col rounded-sm border-l-2 p-3 shadow'
                  >
                    <div className='flex grow flex-col gap-4'>
                      <div className='flex items-center gap-3'>
                        <input
                          type='text'
                          defaultValue={client.name}
                          placeholder='Unnamed'
                          className='focus:border-gray focus:bg-gray-lighter group-hover:bg-gray-lighter min-w-0 grow rounded-sm border border-transparent bg-transparent px-1 py-1 font-semibold outline-hidden'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.currentTarget.blur();
                          }}
                          onBlur={(e) =>
                            window.api.renameClient(client.id, e.target.value)
                          }
                        />
                        <Bars3Icon className='w-4 shrink-0 opacity-50' />
                      </div>
                      <ClientHotkeys client={client} />
                      <div className='flex justify-end gap-4 border-t border-white/10 px-1.5 pt-3'>
                        <button
                          type='button'
                          onClick={() => window.api.toggleMuted(client.id)}
                          className='opacity-50 hover:opacity-100'
                        >
                          {client.isMuted ? (
                            <SpeakerXMarkIcon className='w-5' />
                          ) : (
                            <SpeakerWaveIcon className='w-5' />
                          )}
                        </button>

                        <button
                          type='button'
                          onClick={async () => {
                            if (
                              await confirm(
                                `Are you sure you want to delete ${client.name ?? 'Unnamed'}?`,
                                'This action cannot be undone. This will permanently delete your settings of the selected client on this app.',
                              )
                            ) {
                              window.api.removeClient(client.id);
                            }
                          }}
                          className='opacity-50 hover:opacity-100'
                        >
                          <TrashIcon className='w-5' />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
