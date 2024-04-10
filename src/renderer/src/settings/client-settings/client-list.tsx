import {
  DragDropContext,
  Draggable,
  type DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import SpeakerWaveIcon from '@heroicons/react/24/solid/SpeakerWaveIcon';
import SpeakerXMarkIcon from '@heroicons/react/24/solid/SpeakerXMarkIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import {type FC} from 'react';
import {useClients} from '../../provider/clients-provider';

export const ClientList: FC = () => {
  const {clients, setClients} = useClients();

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
                    className='group mb-2 flex flex-col gap-2 rounded border-l-2 border-blue-lighter bg-gray-light p-2 shadow'
                  >
                    <Bars3Icon className='w-3 shrink-0 self-end' />
                    <div className='flex grow flex-col justify-between px-1'>
                      <input
                        type='text'
                        defaultValue={client.name}
                        placeholder='Unnamed'
                        className='rounded border border-transparent bg-transparent p-1 outline-none focus:border-gray focus:bg-gray-lighter group-hover:bg-gray-lighter'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.currentTarget.blur();
                        }}
                        onBlur={(e) =>
                          window.api.renameClient(client.id, e.target.value)
                        }
                      />
                      <div className='flex gap-4 self-end p-2'>
                        <button
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
                          onClick={() => window.api.removeClient(client.id)}
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
