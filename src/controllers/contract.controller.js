const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const contractService = require('../services/contract.service');

const createContract = catchAsync(async (req, res) => {
  const contractExist = await contractService.contractExists(req.body.tokenAddress);
  if (!contractExist) {
    const contract = await contractService.createContract(req.body);
    console.log(contract)
    res.status(httpStatus.CREATED).send(contract);
  } else {
    console.log(`Contract already exists`);
    return;
  }
});

const getContractByAddress = catchAsync(async (req, res) => {
  const contract = await contractService.getContractByAddress(req.params.tokenAddress);
  res.status(200).send(contract);
});

module.exports = {
  createContract,
  getContractByAddress,
};
