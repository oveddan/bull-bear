import { Chain, configureChains, createClient } from 'wagmi';
import { foundry, goerli, mainnet } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const scrollAlphaChainId = 534353;

const scrollAlphaChain: Chain = {
  id: scrollAlphaChainId,
  name: 'Scroll Alpha',
  // @ts-ignore
  rpcUrls: {
    default: {
      http: ['https://alpha-rpc.scroll.io/l2']
    }
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout.scroll.io'
    }
  },
  network: 'scroll',
  nativeCurrency: mainnet.nativeCurrency
};

const getAllowedChains = () =>
  import.meta.env.MODE === 'development'
    ? [foundry, goerli /*, scrollAlphaChain*/]
    : [goerli /*, scrollAlphaChain*/];

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
