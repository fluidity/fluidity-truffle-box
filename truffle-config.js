require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  // contracts_directory: './flatten',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gasPrice: 10000000000,
      gas: 6700000
    },
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
      gasPrice: 10000000000,
      gas: 6700000
    },
    localUnlimited: {
      host: "localhost",
      network_id: "*",
      port: 8545,
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8545,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY
        ),
      network_id: 4,
    },
  },
  compilers: {
     solc: {
       version: "0.5.13",
       settings: {
         optimizer: {
           enabled: true,
           runs: 20000,
         },
     }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 21
    }
  },
  plugins: ['truffle-verify', 'truffle-flatten'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
  },
}
