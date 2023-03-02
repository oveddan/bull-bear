import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';

import { App } from './App';
import { client } from './wagmi';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      {/* <RainbowKitProvider chains={chains}> */}
      <App />
      {/* </RainbowKitProvider> */}
    </WagmiConfig>
  </React.StrictMode>
);
