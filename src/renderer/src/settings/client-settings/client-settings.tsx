import {type FC} from 'react';
import {useSettings} from '../../provider/settings-provider';
import {SettingsPage} from '../settings-page';
import {ClientList} from './client-list';

export const ClientSettings: FC = () => {
  const settings = useSettings();

  if (!settings) return null;

  return <SettingsPage title='Clients' options={[<ClientList key={0} />]} />;
};
