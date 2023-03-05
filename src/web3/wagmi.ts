import { configureChains, createClient } from 'wagmi';
import { foundry, goerli } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
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

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi'
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    })
  ],
  provider,
  webSocketProvider
});
