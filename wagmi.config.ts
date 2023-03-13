import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import * as chains from 'wagmi/chains';
import { baseChainId, scrollAlphaChainId } from './src/web3/customChains';

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      deployments: {
        BullBear: {
          [scrollAlphaChainId]: '0x889a9c931fd6ae48f961ac3b0b50d8de77ea92a4',
          [baseChainId]: '0xc66611e6c3d042c7c0abed228620a875dcf384f4',
          [chains.foundry.id]: '0x4a679253410272dd5232b3ff7cf5dbb88f295319'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
