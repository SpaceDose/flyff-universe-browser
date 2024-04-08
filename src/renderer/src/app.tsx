import {type FC} from 'react';
import {RouterProvider, createHashRouter} from 'react-router-dom';
import {Playfield} from './playfield/playfield';
import {ClientsProvider} from './provider/clients-provider';
import {PlayfieldProvider} from './provider/playfield-provider';
import {SettingsProvider} from './provider/settings-provider';
import {UpdateStatusProvider} from './provider/update-status-provider';
import {GeneralSettings} from './settings/general-settings';
import {Settings} from './settings/settings';

import '@fontsource/nunito/200.css';
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';

const router = createHashRouter([
  {
    path: '/',
    element: <Playfield />,
  },
  {
    path: '/settings',
    element: <Settings />,
    children: [
      {
        path: '',
        element: <GeneralSettings />,
      },
    ],
  },
]);

export const App: FC = () => (
  <UpdateStatusProvider>
    <SettingsProvider>
      <ClientsProvider>
        <PlayfieldProvider>
          <RouterProvider router={router} />
        </PlayfieldProvider>
      </ClientsProvider>
    </SettingsProvider>
  </UpdateStatusProvider>
);
