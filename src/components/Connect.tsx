import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { chains } from '../wagmi';

export function Connect() {
  return (
    <RainbowKitProvider chains={chains}>
      <ConnectButton />
    </RainbowKitProvider>
  );
}
