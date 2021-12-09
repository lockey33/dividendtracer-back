const catchAsync = require('../utils/catchAsync');
const coinService = require('../services/coin.service');
const userService = require('../services/user.service');

const createCoin = catchAsync(async (req, res) => {
  const coinExist = await coinService.coinExists(req.body.tokenAddress, req.body.wallet);
  if (!coinExist) {
    const newCoin = { ...req.body };
    newCoin.increment = 1;
    console.log(newCoin);
    if (newCoin.globalReward !== '0.00') {
      await coinService.createCoin(newCoin);
      await userService.updateRewards(req.body.wallet, newCoin);
    }
  } else {
    console.log(`Coin already exists`);
    const coin = await coinService.getCoin(req.body.tokenAddress, req.body.wallet);
    coin.increment += 1;
    await coin.save();
    await userService.updateRewards(req.body.wallet, coin);
  }
  res.send('success');
});

const getCoin = catchAsync(async (req, res) => {
  const contract = await coinService.getCoin(req.params.tokenAddress, req.params.wallet);
  res.send(contract);
});

module.exports = {
  createCoin,
  getCoin,
};
