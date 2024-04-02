import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon';
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon';
import {useContext, type FC} from 'react';
import {ClientsContext} from '../provider/clients-provider';
import {PanelSettingsContext} from '../provider/panel-settings-provider';
import {ClientNavigation} from './client-navigation/client-navigation';
import {NavigationDivider} from './navigation-divider';
import {PanelControl} from './panel-control';
import {UpdateButton} from './update-button';

export const Navigation: FC = () => {
  const panelSettings = useContext(PanelSettingsContext);
  const clients = useContext(ClientsContext);

  const {showNavigation, padding, navigationHeight} = panelSettings;

  return (
    <div
      className='flex w-full flex-col overflow-hidden bg-gray'
      style={{height: showNavigation ? navigationHeight : padding}}
    >
      <button
        onClick={() => {
          window.api.setPanelSettings({
            ...panelSettings,
            showNavigation: !panelSettings.showNavigation,
          });
        }}
        className='flex w-full items-center justify-center bg-black'
        style={{height: padding}}
      >
        {showNavigation ? (
          <ChevronDownIcon className='h-3' />
        ) : (
          <ChevronUpIcon className='h-3' />
        )}
      </button>

      {showNavigation && (
        <div className='flex grow gap-4 px-4 py-2'>
          <PanelControl panels={panelSettings.panels} />
          <NavigationDivider />
          <ClientNavigation clients={clients} panelSettings={panelSettings} />
          <div className='ml-auto flex items-center gap-4'>
            <UpdateButton />
          </div>
        </div>
      )}
    </div>
  );
};
