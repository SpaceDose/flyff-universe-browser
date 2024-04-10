import {AnimatePresence, motion} from 'framer-motion';
import {type FC} from 'react';
import {useConfirm} from './useConfirm';

export const ConfirmationDialog: FC = () => {
  const {onConfirm, onCancel, confirmationState} = useConfirm();

  return (
    <AnimatePresence>
      {confirmationState.show && (
        <>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.1}}
            className='fixed inset-auto top-1/2 z-50 flex max-w-lg -translate-y-1/2 flex-col gap-4 rounded bg-gray-dark p-4 text-white shadow'
          >
            <h1 className='text-lg font-bold'>{confirmationState.title}</h1>

            <p>{confirmationState.text}</p>

            <div className='ml-auto flex gap-4'>
              <button
                type='button'
                onClick={onConfirm}
                className='rounded px-2 py-1'
              >
                Yes
              </button>

              <button
                type='button'
                onClick={onCancel}
                className='rounded bg-blue px-2 py-1 shadow'
              >
                Cancel
              </button>
            </div>
          </motion.div>

          <motion.div
            onClick={onCancel}
            className='fixed top-0 h-screen w-screen bg-black/85'
          />
        </>
      )}
    </AnimatePresence>
  );
};
