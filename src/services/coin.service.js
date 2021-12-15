const Coin = require('../models/coin.model');

const createCoin = async (coinBody) => {
  let coin = { tokenAddress: coinBody.tokenAddress, name: coinBody.tokenName, symbol: coinBody.tokenSymbol, increment: coinBody.increment };
  return Coin.create(coin);
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
  getCoin,
  getTrendingCoins
};
