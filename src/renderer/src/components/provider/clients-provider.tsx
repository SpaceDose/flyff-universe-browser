import {
  type ReactNode,
  createContext,
  type FC,
  useState,
  useEffect,
} from 'react';
import {type Client} from '../../../../preload/types';

type ClientsProviderProps = {
  children: ReactNode;
};

export const ClientsContext = createContext<Client[]>([]);

export const ClientsProvider: FC<ClientsProviderProps> = ({children}) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    window.api.getClients().then((clients) => setClients(clients));
  }, []);

  useEffect(() => {
    const pushClientsUpdateEl = window.api.pushClientsUpdate((_, clients) =>
      setClients(clients),
    );

    return () => {
      pushClientsUpdateEl();
    };
  }, []);

  return (
    <ClientsContext.Provider value={clients}>
      {children}
    </ClientsContext.Provider>
  );
};
