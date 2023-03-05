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
          [scrollAlphaChainId]: '0xa6a8c083d22461c9cb60d7efd364d82062d48434',
          [baseChainId]: '0xAa9ADB5bcBA67e98eef5Bfc71020a3CA43aD083e',
          [chains.foundry.id]: '0xb0d4afd8879ed9f52b28595d31b441d079b2ca07'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
