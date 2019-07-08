module.exports = {
    port: 8545,
    norpc: true,
    testCommand: 'truffle test --network coverage',
    copyPackages: ['openzeppelin-solidity'],
    skipFiles: ['MockContract.sol']
};