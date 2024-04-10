import {useContext} from 'react';
import {ConfirmContext} from './confirm-context-provider';

let resolveCallback: (result: boolean) => void;
export function useConfirm() {
  const [confirmationState, setConfirmationState] = useContext(ConfirmContext);

  const onConfirm = () => {
    closeConfirm();
    resolveCallback(true);
  };

  const onCancel = () => {
    closeConfirm();
    resolveCallback(false);
  };

  const confirm = (title: string, text?: string) => {
    setConfirmationState({
      show: true,
      title,
      text,
    });

    return new Promise((result) => {
      resolveCallback = result;
    });
  };

  const closeConfirm = () => {
    setConfirmationState({
      show: false,
    });
  };

  return {confirm, onConfirm, onCancel, confirmationState};
}
