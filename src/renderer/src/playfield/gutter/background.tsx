import {type FC, useContext} from 'react';
import Logo from '../../assets/logo.png';
import TutorialWithClients from '../../assets/tutorial-with-clients.svg';
import TutorialWithoutClients from '../../assets/tutorial-without-clients.svg';
import {ClientsContext} from '../../provider/clients-provider';

export const Background: FC = () => {
  const clients = useContext(ClientsContext);

  return (
    <>
      <img
        src={Logo}
        className='p-4 min-w-max pointer-events-none select-none'
      />
      <img
        src={
          clients.length === 0 ? TutorialWithoutClients : TutorialWithClients
        }
        className='h-48 absolute bottom-4 left-14 pointer-events-none min-w-max select-none'
      />
    </>
  );
};
