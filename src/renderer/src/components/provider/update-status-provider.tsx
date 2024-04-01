import {
  type FC,
  type ReactNode,
  createContext,
  useEffect,
  useState,
} from 'react';

type UpdateStatusProviderProps = {
  children: ReactNode;
};

type UpdateStatus = {
  downloading?: boolean;
  readyToInstall?: boolean;
};

export const UpdateStatusContext = createContext<UpdateStatus>({});

export const UpdateStatusProvider: FC<UpdateStatusProviderProps> = ({
  children,
}) => {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateStatus>({});

  useEffect(() => {
    const pushUpdateAvailableEl = window.api.pushUpdateAvailable(() => {
      setUpdateAvailable({downloading: true});
    });

    const pushUpdateReadyToInstallEl = window.api.pushUpdateReadyToInstall(
      () => {
        setUpdateAvailable({readyToInstall: true});
      },
    );

    return () => {
      pushUpdateAvailableEl();
      pushUpdateReadyToInstallEl();
    };
  }, []);

  return (
    <UpdateStatusContext.Provider value={updateAvailable}>
      {children}
    </UpdateStatusContext.Provider>
  );
};
