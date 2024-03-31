import {
  type FC,
  type ReactNode,
  createContext,
  useEffect,
  useState,
} from 'react';

type UpdateAvailableProviderProps = {
  children: ReactNode;
};

export const UpdateAvailableProviderContext = createContext<boolean>(false);

export const UpdateAvailableProvider: FC<UpdateAvailableProviderProps> = ({
  children,
}) => {
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);

  useEffect(() => {
    const pushUpdateAvailableEl = window.api.pushUpdateAvailable(() => {
      setUpdateAvailable(true);
    });

    return () => {
      pushUpdateAvailableEl();
    };
  }, []);

  return (
    <UpdateAvailableProviderContext.Provider value={updateAvailable}>
      {children}
    </UpdateAvailableProviderContext.Provider>
  );
};
