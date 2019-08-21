var SampleContract = artifacts.require("./SampleContract.sol");
const helper = require('./migration_utils.js');

module.exports = async(deployer, network, accounts) => {
  await SampleContract.deployed()

  await helper.saveContractData(
    web3,
    [SampleContract],
    "Singleton"
  )
}