const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  try{
    const userExist = await userService.userExists(req.body.address);
    if(!userExist){
      const user = await userService.createUser(req.body);
      res.status(httpStatus.CREATED).send(user);
    }else{
      throw new ApiError('User already exists');
    }
  }catch(err){
   console.log(err);
  }
});

const getUserByAddress = catchAsync(async (req, res) => {
  try{
    const user = await userService.getUserByAddress(req.body.address);
    res.send(user);
  }catch(err){
    console.log(err)
  }
});

const addToSearchHistory = catchAsync(async (req, res) => {
  try{
      const user = await userService.addToSearchHistory(req.body.address, req.body.tokenAddress, req.body.tokenName, req.body.symbol);
      res.send(user);
  }catch(err){
      console.log(err)
  }
});

const removeFromSearchHistory = catchAsync(async (req, res) => {
  try{
    const user = await userService.removeFromSearchHistory(req.body.address, req.body.tokenAddress);
    res.send(user);
  }catch(err){
    console.log(err)
  }
});

const addToWatchlist = catchAsync(async (req, res) => {
  try{
      const user = await userService.addToWatchlist(req.body.address, req.body.tokenAddress, req.body.tokenName, req.body.symbol);
      res.send(user);
  }catch(err){
      console.log(err)
  }
});

const removeFromWatchlist = catchAsync(async (req, res) => {
  try{
    const user = await userService.removeFromWatchlist(req.body.address, req.body.tokenAddress);
    res.send(user);
  }catch(err){
    console.log(err)
  }
});


const getUserWatchlist = catchAsync(async (req, res) => {
  try {
    const user = await userService.getUserWatchlist(req.body.address);
    res.send(user);
  }catch(error){
    console.log(err)
  }
});

const getUserSearchHistory = catchAsync(async (req, res) => {
  try {
    const user = await userService.getUserSearchHistory(req.body.address);
    res.send(user);
  }catch(error){
    console.log(error)
  }
});

module.exports = {
  createUser,
  getUserByAddress,
  addToSearchHistory,
  addToWatchlist,
  removeFromWatchlist,
  removeFromSearchHistory,
  getUserWatchlist,
  getUserSearchHistory
};
