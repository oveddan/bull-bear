import { configureChains, createClient } from 'wagmi';
import { foundry } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import {
  baseChain,
  scrollAlphaChain,
  scrollAlphaChainId
} from './customChains';

const getAllowedChains = () =>
  import.meta.env.MODE === 'development'
    ? [foundry, scrollAlphaChain, baseChain]
    : [scrollAlphaChain, baseChain];

const getUrl = (chainId: number) => {
  if (chainId == foundry.id) return `http://127.0.0.1:8545`;
  if (chainId == scrollAlphaChainId) return 'https://alpha-rpc.scroll.io/l2';

  return `http://127.0.0.1:8545`;
};

export const { chains, provider, webSocketProvider } = configureChains(
  getAllowedChains(),
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: getUrl(chain.id)
      })
    })
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My Mul',
  chains
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
});
