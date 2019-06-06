var fs = require('fs')
var extend = require('extend')
const FILE_NAME = "/.contract_addresses.json"
const JSON_FILE_PATH = __dirname + FILE_NAME

const getContractData = async (web3, contract) => {
  try {
    let contractData = new Object()
    if(contract.transactionHash !== undefined) {
      let receipt = await web3.eth.getTransactionReceipt(contract.transactionHash)
      contractData.timestamp = await getTimestamp(web3, receipt.blockHash)
      contractData.deployingAddress = receipt.from
      contractData.gasUsed = receipt.cumulativeGasUsed
    }
    contractData.address = contract.address
    contractData.transactionHash = contract.transactionHash
    return contractData
  } catch (err) {
    throw err
  }
}

const getContractName = (contract) => {
  try {
    //singletons use this method
    if (contract.contractName !== undefined) {
      return contract.contractName
    }
    //instances user this method
    return contract.constructor.contractName
  } catch (err) {
    throw err
  }
}

const getTimestamp = async(web3, blockHash) => {
  try {
    let block = await web3.eth.getBlock(blockHash)
    return block.timestamp
  } catch (err) {
    throw err
  }
}

const asyncForEach = async(array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const jsonOutput = (data) => {
  return JSON.stringify(data, null, 2)
}

const generateContractDataMap = async (web3, contractList, deploymentId) => {
  if(contractList == null || contractList.length == 0) {
    return {}
  }

  let contractDataMap = {}
  let networkType = await web3.eth.net.getNetworkType()
  contractDataMap[networkType] = {}
  contractDataMap[networkType][deploymentId] = {}
  totalGas = 0
  await asyncForEach(contractList, async (contract) => {
    //skip invalid contracts
    if (contract == null || Object.keys(contract).length == 0) {
      return
    }
    try{
      let contractData = await getContractData(web3, contract)
      let contract_name = getContractName(contract)
      contractDataMap[networkType][deploymentId][contract_name] = contractData
      totalGas += contractData.gasUsed
    } catch (err) {
      throw err
    }
  })
  contractDataMap.totalGasUsed = totalGas
  console.log(jsonOutput(contractDataMap))
  return contractDataMap
}

const saveContractData = async (web3, contractList, deploymentId) => {
  let newContractDataItems = await generateContractDataMap(web3, contractList, deploymentId)

  let contractDataMap = null
  //try and get existing contract data list if it exists
  try {
    file_content = fs.readFileSync(JSON_FILE_PATH)
    contractDataMap = JSON.parse(file_content)
    console.log("Loaded Prior Contract Addresses " + FILE_NAME)
  } catch (err) {
    console.log(FILE_NAME + " does not exist, will create")
    contractDataMap = {}
  }

  //add and update the contractDataMap
  extend(true, contractDataMap, newContractDataItems)
  console.log("Updated Contract Addresses " + FILE_NAME)

  try {
    fs.writeFileSync(JSON_FILE_PATH, jsonOutput(contractDataMap))
  } catch (err) {
    console.log("Unable to write Contract Addresses " + FILE_NAME)
    throw err
  }
}

module.exports = {
  generateContractDataMap,
  saveContractData,
}
