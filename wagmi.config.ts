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
          [scrollAlphaChainId]: '0x494344159e4fa881cf60d350a24c10c485639173',
          [baseChainId]: '0xf70abdb571bac66dd095ec1140ee99ca57dd1465',
          [chains.foundry.id]: '0x2a810409872afc346f9b5b26571fd6ec42ea4849'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
