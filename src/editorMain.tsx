import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { EditorApp } from './EditorApp';
import 'reactflow/dist/style.css';
import './editorIndex.css';

import { client } from './web3/wagmi';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <EditorApp />
    </WagmiConfig>
  </React.StrictMode>
);
