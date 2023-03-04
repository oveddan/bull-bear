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
          [chains.foundry.id]: '0x5fbdb2315678afecb367f032d93f642f64180aa3'
        }
      }
      // project: './contracts'
    }),
    react()
  ]
});
