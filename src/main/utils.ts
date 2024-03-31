import {_openClient, clients} from './clients';
import {panelSettings} from './panels/panels';
import {win} from '.';

export const keyboardShortcuts: (
  event: {preventDefault: () => void},
  input: Electron.Input,
) => void = (event, input) => {
  if (input.type === 'keyDown' && input.alt && input.key === 'Enter') {
    event.preventDefault();
    win?.setFullScreen(!win.isFullScreen());
  }

  if (
    input.type === 'keyDown' &&
    input.alt &&
    (input.key === 'ArrowLeft' || input.key === 'ArrowRight')
  ) {
    event.preventDefault();
    const activePanels = panelSettings.panels.filter((p) => p.active);
    if (activePanels.length === 1) {
      const activeClient = clients.find(
        (c) => c.id === activePanels[0].clientId,
      );
      if (activeClient) {
        const clientToOpen = clients.find((c) => {
          const targetOrder =
            activeClient.order + (input.key === 'ArrowLeft' ? -1 : 1);

          return (
            c.order ===
            (targetOrder < 0
              ? clients.length - 1
              : targetOrder === clients.length
                ? 0
                : targetOrder)
          );
        });
        if (clientToOpen) _openClient(clientToOpen?.id, 0);
      } else {
        const sortedClient = clients.sort((a, b) => a.order - b.order);
        if (sortedClient.length > 0) {
          _openClient(sortedClient[0].id, 0);
        }
      }
    }
  }
};
