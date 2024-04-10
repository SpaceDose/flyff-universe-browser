import {
  type ReactNode,
  createContext,
  type FC,
  useState,
  useEffect,
  useContext,
} from 'react';
import {type Client} from '../../../preload/types';

type ClientsProviderProps = {
  children: ReactNode;
};

const ClientsContext = createContext<{
  clients: Client[];
  setClients: (clients: Client[]) => void;
}>({clients: [], setClients: () => {}});

export const useClients = () => useContext(ClientsContext);

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
    <ClientsContext.Provider value={{clients, setClients}}>
      {children}
    </ClientsContext.Provider>
  );
};
