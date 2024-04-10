import {type FC} from 'react';
import Logo from '../../assets/logo.png';
import TutorialWithClients from '../../assets/tutorial-with-clients.svg';
import TutorialWithoutClients from '../../assets/tutorial-without-clients.svg';
import {useClients} from '../../provider/clients-provider';

export const Background: FC = () => {
  const {clients} = useClients();

  return (
    <>
      <img
        src={Logo}
        className='pointer-events-none min-w-max select-none p-4'
      />
      <img
        src={
          clients.length === 0 ? TutorialWithoutClients : TutorialWithClients
        }
        className='pointer-events-none absolute bottom-4 left-14 h-48 min-w-max select-none'
      />
    </>
  );
};
