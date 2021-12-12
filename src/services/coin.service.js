const Coin = require('../models/coin.model');

const createCoin = async (coinBody) => {
  let coin = { tokenAddress: coinBody.tokenAddress, increment: coinBody.increment };
  return Coin.create(coin);
};

const coinExists = async (coinAddress, wallet) => {
  const contract = await Coin.findOne({ tokenAddress: coinAddress, wallet });
  return !!contract;
};

const getCoin = async (coinAddress, wallet) => {
  return Coin.findOne({ tokenAddress: coinAddress, wallet });
};

module.exports = {
  createCoin,
  coinExists,
  getCoin,
};
