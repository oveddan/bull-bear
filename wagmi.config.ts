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
          [scrollAlphaChainId]: '0xafa015ac9233aa4da147e4ac9c7811c79e8cc6d5',
          [baseChainId]: '0xc66611e6c3d042c7c0abed228620a875dcf384f4',
          [chains.foundry.id]: '0xD84379CEae14AA33C123Af12424A37803F885889'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
