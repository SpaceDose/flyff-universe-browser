import {
  type Dispatch,
  type FC,
  createContext,
  useState,
  type ReactNode,
} from 'react';

export interface ConfirmationState {
  show: boolean;
  title?: string;
  text?: string;
}

export const ConfirmContext = createContext<
  [ConfirmationState, Dispatch<ConfirmationState>]
>([{show: false}, () => null]);

interface ConfirmContextProviderProps {
  children: ReactNode;
}

export const ConfirmContextProvider: FC<ConfirmContextProviderProps> = ({
  children,
}) => {
  const confirmationStateControl = useState<ConfirmationState>({show: false});

  return (
    <ConfirmContext.Provider value={confirmationStateControl}>
      {children}
    </ConfirmContext.Provider>
  );
};
