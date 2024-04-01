import {Theme} from '@radix-ui/themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './app';

import './index.css';
import '@radix-ui/themes/styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>,
);
