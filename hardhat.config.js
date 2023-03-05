require('@nomicfoundation/hardhat-foundry');
require('@nomiclabs/hardhat-etherscan');
// import '@nomicfoundation/hardhat-foundry';
// import '@nomiclabs/hardhat-etherscan';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.9',
  networks: {
    // for testnet
    'base-goerli': {
      url: 'https://goerli.base.org'
    }
  },

  etherscan: {
    // abiKey: process.env.ETHERSCAN_KEY as string,
    // apiKey: {
    //   // Uncomment for Blockscout
    //   // No api key is needed for Basescan
    //   // Blockscout
    //   // "base-goerli": process.env.BLOCKSCOUT_KEY as string
    // },
    apiKey: {
      'base-goerli': '1aca0c00-77e6-428c-9e09-8a2d688639f7'
    },
    customChains: [
      {
        network: 'base-goerli',
        chainId: 84531,
        urls: {
          // Pick a block explorer and uncomment those lines
          // Blockscout
          // apiURL: 'https://base-goerli.blockscout.com/api',
          // browserURL: 'https://base-goerli.blockscout.com'
          // Basescan by Etherscan
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org'
        }
      }
    ]
  }
};
