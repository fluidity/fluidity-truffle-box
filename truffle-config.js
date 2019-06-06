const PrivateKeyProvider = require('truffle-privatekey-provider')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, './.env.truffle') })
const privateKey = process.env.PRIVATE_KEY
const apiKey = process.env.INFURA_API_KEY

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gasPrice: 10000000000,
      gas: 7000000
    },
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
      gasPrice: 10000000000,
      gas: 7000000
    },
    rinkeby: privateKey ? ({
      provider: new PrivateKeyProvider(
        privateKey,
        'https://rinkeby.infura.io/' + apiKey
      ),
      network_id: '4', // eslint-disable-line camelcase
      gasPrice: 10000000000,
      gas: 4800000
    }) : undefined,
    production: {
      from: '0xe87529a6123a74320e13a6dabf3606630683c029',
      network_id: '1', // eslint-disable-line camelcase
      gasPrice: 9000000000,
      gas: 4003918
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
  },
  compilers: {
     solc: {
       version: "0.5.2",
       optimization: false
     }
  }
}
