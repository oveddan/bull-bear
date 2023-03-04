import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import * as chains from 'wagmi/chains';

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      deployments: {
        BullBear: {
          [chains.mainnet.id]: '0x1A61839Eb5fC6eBBcAe01eD5E79062E598792Dac',
          [chains.goerli.id]: '0x68bac2d9e4e429010D3DdC5f00d33f28c9de1B2e',
          [chains.foundry.id]: '0x0165878a594ca255338adfa4d48449f69242eb8f'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
