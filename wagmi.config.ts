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
          [baseChainId]: '0xdADf5A7338827E576f0C373888E8740aF73E5aBB',
          [chains.foundry.id]: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
