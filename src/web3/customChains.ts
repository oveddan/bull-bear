import { Chain, mainnet } from 'wagmi';

export const scrollAlphaChainId = 534353;

export const scrollAlphaChain: Chain = {
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

export const baseChainId = 84531;

export const baseChain: Chain = {
  id: baseChainId,
  name: 'Base Goerli',
  // @ts-ignore
  rpcUrls: {
    default: {
      http: ['https://goerli.base.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://goerli.basescan.org'
    }
  }
};
