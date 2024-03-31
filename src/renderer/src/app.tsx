import {type FC} from 'react';
import {Navigation} from './components/navigation/navigation';
import {Panels} from './components/panels/panels';
import {ClientsProvider} from './components/provider/clients-provider';
import {PanelSettingsProvider} from './components/provider/panel-settings-provider';
import '@fontsource/nunito';
import {UpdateAvailableProvider} from './components/provider/update-available-provider';

export const App: FC = () => (
  <UpdateAvailableProvider>
    <ClientsProvider>
      <PanelSettingsProvider>
        <div className='flex h-screen flex-col bg-blue-lighter text-white'>
          <Panels />
          <Navigation />
        </div>
      </PanelSettingsProvider>
    </ClientsProvider>
  </UpdateAvailableProvider>
);
