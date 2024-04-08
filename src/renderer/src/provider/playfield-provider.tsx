import {
  type ReactNode,
  type FC,
  useEffect,
  useState,
  createContext,
} from 'react';
import {type Playfield} from '../../../preload/types';

type PlayfieldProviderProps = {
  children: ReactNode;
};

const defaultValues: Playfield = {
  panels: [],
  splitX: 512,
  splitY: 304,
  padding: 12,
  navigationHeight: 112,
  showNavigation: true,
};

export const PlayfieldContext = createContext<Playfield>(defaultValues);

export const PlayfieldProvider: FC<PlayfieldProviderProps> = ({children}) => {
  const [playfield, setPlayfield] = useState<Playfield>(defaultValues);

  useEffect(() => {
    window.api.getPlayfield().then((pSettings) => setPlayfield(pSettings));
  }, []);

  useEffect(() => {
    const pushPlayfieldUpdateEl = window.api.pushPlayfieldUpdate(
      (_, settings) => setPlayfield(settings),
    );

    return () => {
      pushPlayfieldUpdateEl();
    };
  }, []);

  return (
    <PlayfieldContext.Provider value={playfield}>
      {children}
    </PlayfieldContext.Provider>
  );
};
