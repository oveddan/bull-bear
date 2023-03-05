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
          [scrollAlphaChainId]: '0x3f78307b78ab843cd16ec49c59e1e41f2d493d88',
          [baseChainId]: '0xAa9ADB5bcBA67e98eef5Bfc71020a3CA43aD083e',
          [chains.foundry.id]: '0x5fc748f1feb28d7b76fa1c6b07d8ba2d5535177c'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
