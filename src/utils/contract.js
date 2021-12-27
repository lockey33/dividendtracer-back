const ethers = require('ethers');
const ERC20 = require('../abi/ERC20.json');

const mainNet = 'https://bsc-dataseed.binance.org/';
const provider = new ethers.providers.JsonRpcProvider(mainNet);

async function getTokenName(address) {
  const tokenContract = await getFreeContractInstance(address, ERC20);
  const tokenName = await callContractMethod(tokenContract, 'name');
  return tokenName;
}

async function checkRewardToken(address) {
  let isReward = false;
  const tokenContract = await getFreeContractInstance(address, ERC20);
  isReward = await callContractMethod(tokenContract, 'dividendTracker');

  return isReward;
}

async function callContractMethod(contractInstance, methodName, options = {}) {
  let resultOfCall = null;
  try {
    switch (methodName) {
      default:
        resultOfCall = await contractInstance[methodName]();
        break;
    }
  } catch (err) {
    //console.log('error', methodName, options);
    if (err.code === 'UNPREDICTABLE_GAS_LIMIT') {
      return true;
    }
    //console.log(err);
    return false;
  }

  return resultOfCall;
}

async function getFreeContractInstance(contractAddress, abi, signerOrProvider = provider) {
  const contract = new ethers.Contract(contractAddress, abi, signerOrProvider);
  return contract;
}

module.exports = {
  getTokenName,
  callContractMethod,
  checkRewardToken,
};
