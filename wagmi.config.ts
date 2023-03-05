import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import * as chains from 'wagmi/chains';
import { scrollAlphaChainId } from './src/web3/customChains';

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      deployments: {
        BullBear: {
          [scrollAlphaChainId]: '0xa6a8c083d22461c9cb60d7efd364d82062d48434',
          [chains.goerli.id]: '0x68bac2d9e4e429010D3DdC5f00d33f28c9de1B2e',
          [chains.foundry.id]: '0x5fbdb2315678afecb367f032d93f642f64180aa3'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
