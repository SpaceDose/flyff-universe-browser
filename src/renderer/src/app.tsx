import {type FC} from 'react';
import {Navigation} from './components/navigation/navigation';
import {Panels} from './components/panels/panels';
import {ClientsProvider} from './components/provider/clients-provider';
import {PanelSettingsProvider} from './components/provider/panel-settings-provider';
import '@fontsource/nunito';
import {UpdateStatusProvider} from './components/provider/update-status-provider';

export const App: FC = () => (
  <UpdateStatusProvider>
    <ClientsProvider>
      <PanelSettingsProvider>
        <div className='flex h-screen flex-col bg-blue-lighter text-white'>
          <Panels />
          <Navigation />
        </div>
      </PanelSettingsProvider>
    </ClientsProvider>
  </UpdateStatusProvider>
);
