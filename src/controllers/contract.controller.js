const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { contractService } = require('../services');

const createContract = catchAsync(async (req, res) => {
  const contractExist = await contractService.contractExists(req.body.address);
  if (!contractExist) {
    const contract = await contractService.createContract(req.body);
    res.status(httpStatus.CREATED).send(contract);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contract already exists');
  }
});

const getContractByAddress = catchAsync(async (req, res) => {
  const contract = await contractService.getContractByAddress(req.body.address);
  if (!contract) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(contract);
});

module.exports = {
  createContract,
  getContractByAddress,
};
