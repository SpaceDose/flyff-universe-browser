import {type FC} from 'react';
import {Navigation} from './components/navigation/navigation';
import {Panels} from './components/panels/panels';
import {ClientsProvider} from './components/provider/clients-provider';
import {PanelSettingsProvider} from './components/provider/panel-settings-provider';
import {SettingsProvider} from './components/provider/settings-provider';
import {UpdateStatusProvider} from './components/provider/update-status-provider';
import {Settings} from './components/settings/settings';

import '@fontsource/nunito/200.css';
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';

export const App: FC = () => (
  <UpdateStatusProvider>
    <SettingsProvider>
      <ClientsProvider>
        <PanelSettingsProvider>
          <div className='flex h-screen flex-col bg-blue-lighter text-white'>
            <Settings />
            <Panels />
            <Navigation />
          </div>
        </PanelSettingsProvider>
      </ClientsProvider>
    </SettingsProvider>
  </UpdateStatusProvider>
);
