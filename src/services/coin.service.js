const Coin = require('../models/coin.model');
const RewardCoin = require('../models/rewardCoin.model');
const userService = require("../services/user.service");

const createCoin = async (coinBody) => {
  let coin = { tokenAddress: coinBody.tokenAddress, name: coinBody.tokenName, symbol: coinBody.tokenSymbol, increment: coinBody.increment };
  return Coin.create(coin);
};

const createRewardCoin = async (tokenAddress, name) => {
  const coinExist = await rewardCoinExists(tokenAddress);
  if (!coinExist) {
    let coin = {tokenAddress, name};
    return RewardCoin.create(coin);
  }
};

const rewardCoinExists = async (coinAddress) => {
  const contract = await RewardCoin.findOne({ tokenAddress: coinAddress });
  return !!contract;
};

const coinExists = async (coinAddress) => {
  const contract = await Coin.findOne({ tokenAddress: coinAddress });
  return !!contract;
};

const getCoin = async (coinAddress) => {
  return Coin.findOne({ tokenAddress: coinAddress });
};

const getTrendingCoins = async () => {
  return Coin.find({}).sort({ increment: -1 }).limit(10);
};

module.exports = {
  createCoin,
  coinExists,
  rewardCoinExists,
  getCoin,
  getTrendingCoins,
  createRewardCoin,
};
