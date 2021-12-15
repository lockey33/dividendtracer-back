const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userAdress) => {
  return User.create({address: userAdress});
};

const userExists = async (userAddress) => {
  const user = await User.findOne({ address: userAddress });
  return !!user;
};

const getUserByWalletAddress = async (userAddress) => {
  return User.findOne({ address: userAddress });
};

const getUserByAddress = async (userAddress) => {
  const user = await getUserByWalletAddress(userAddress);
  return user;
};

const addToSearchHistory = async (userAddress, tokenAddress, tokenName, symbol) => {
  const user = await getUserByWalletAddress(userAddress);
  if (!user) {
    console.log('User not found');
  }
  if (user.searchHistory && user.searchHistory.some((item) => item.address === tokenAddress)) {
    console.log('Token already in search history');
    return;
  }else{
    user.searchHistory.push({
      address: tokenAddress,
      name: tokenName,
      symbol,
    });
    await user.save();
  }
  return user.searchHistory;
};

const addToWatchlist = async (userAddress, tokenAddress, tokenName, symbol) => {
    const user = await getUserByWalletAddress(userAddress);
    if (!user) {
      console.log('User not found');
    }
    if (user.watchlist.some((item) => item.address === tokenAddress)) {
      console.log('Token already in watchlist');
    } else {
      user.watchlist.push({
        address: tokenAddress,
        name: tokenName,
        symbol,
      });
      await user.save();      
    }
    return user.watchlist;
};

const removeFromWatchlist = async (userAddress, tokenAddress) => {
  try {
    const user = await getUserByWalletAddress(userAddress);
    if (!user) {
      console.log('User not found');
    }
    const watchlist = user.watchlist.filter((item) => item.address !== tokenAddress);
    user.watchlist = watchlist;
    await user.save();
    return user.watchlist;
  } catch (err) {
    console.log(err);
  }
};

const removeFromSearchHistory = async (userAddress, tokenAddress) => {
  try {
    const user = await getUserByWalletAddress(userAddress);
    if (!user) {
      console.log('User not found');
    }
    const searchHistory = user.searchHistory.filter((item) => item.address !== tokenAddress);
    user.searchHistory = searchHistory;
    await user.save();
    return user.searchHistory;
  } catch (err) {
    console.log(err);
  }
};

const getUserWatchlist = async (userAddress) => {
    const user = await User.findOne({ address: userAddress }, { watchlist: 1, _id: 0 });
    return user.watchlist;
};

const getUserSearchHistory = async (userAddress) => {
    console.log(userAddress)
    const user = await User.findOne({ address: userAddress }, { searchHistory: 1, _id: 0 }).sort({ createdAt: 1 });
    return user.searchHistory;
};

const rewardsExists = async (userAddress, tokenAddress) => {
  const exist = await User.findOne({
    $and: [{ rewards: { $elemMatch: { tokenAddress } } }, { address: userAddress }],
  });
  if (exist == null) {
    return false;
  }
  return true;
};

const updateRewards = async (userAddress, coin) => {
  const rewardObject = {
    tokenAddress: coin.tokenAddress,
    globalReward: coin.globalReward,
    todayReward: coin.todayReward,
  };

  const rewardsAlreadyExist = await rewardsExists(userAddress, coin.tokenAddress, true);

  if (rewardsAlreadyExist) {
    await User.updateOne(
      {
        $and: [{ rewards: { $elemMatch: { tokenAddress: coin.tokenAddress } } }, { address: userAddress }],
      },
      {
        $set: {
          'rewards.$.globalReward': rewardObject.globalReward,
          'rewards.$.todayReward': rewardObject.todayReward,
        },
      }
    );
  } else {
    const user = await User.findOne({ address: userAddress });
    console.log(user)
    user.rewards.push(rewardObject);
    user.save();
  }
};

module.exports = {
  createUser,
  userExists,
  getUserByAddress,
  addToSearchHistory,
  addToWatchlist,
  removeFromWatchlist,
  removeFromSearchHistory,
  getUserWatchlist,
  getUserSearchHistory,
  rewardsExists,
  updateRewards,
};
