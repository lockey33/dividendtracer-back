const catchAsync = require('../utils/catchAsync');
const coinService = require('../services/coin.service');
const userService = require('../services/user.service');
const blockChainService = require('../services/blockchain.service');

const createCoin = catchAsync(async (req, res) => {
  const coinExist = await coinService.coinExists(req.body.tokenAddress);
  const userExist = await userService.userExists(req.body.wallet);
  if (!coinExist) {
    const newCoin = { ...req.body };
    newCoin.increment = 1;
    await coinService.createCoin(newCoin);
    if (newCoin.globalReward !== '0.00' && userExist) {
      await userService.updateRewards(req.body.wallet, newCoin);
    }
  } else {
    console.log(`Coin already exists`);
    const coin = await coinService.getCoin(req.body.tokenAddress);
    coin.increment += 1;
    await coin.save();
    if(userExist) await userService.updateRewards(req.body.wallet, coin);
  }
  res.status(200).send('success');
});


const listenRewardCoins = catchAsync(async (req, res) => {
  await blockChainService.listenRewardCoins();
  res.status(200).send('success');
});

const getCoin = catchAsync(async (req, res) => {
  const contract = await coinService.getCoin(req.params.tokenAddress);
  res.send(contract);
});

const getTrendingCoins = catchAsync(async (req, res) => {
  const coins = await coinService.getTrendingCoins();
  res.send(coins);
});

module.exports = {
  createCoin,
  getCoin,
  getTrendingCoins,
  listenRewardCoins
};
