const Contract = require('../models/contract.model');

const createContract = async (contractBody) => {
  return Contract.create(contractBody);
};

const contractExists = async (contractAddress) => {
  const contract = await Contract.findOne({ tokenAddress: contractAddress });
  return !!contract;
};

const getContractByAddress = async (contractAddress) => {
  return Contract.findOne({ tokenAddress: contractAddress });
};

module.exports = {
  createContract,
  contractExists,
  getContractByAddress,
};
