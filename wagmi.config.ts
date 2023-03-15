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
          [scrollAlphaChainId]: '0xcef509cB6D308beB69357eD1d9A51611e2417948',
          [baseChainId]: '0x93ddf3c83648dae65eafa3289457f38d0aad797c',
          [chains.foundry.id]: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
