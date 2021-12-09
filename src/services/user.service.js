const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  return User.create(userBody);
};

const userExists = async (userAddress) => {
  const user = await User.findOne({'address': userAddress});
  return !!user;
};

const getUserByWalletAddress = async (userAddress) => {
  return User.findOne({'address': userAddress });
};

 const getUserByAddress = async (userAddress) => {
  const user = await getUserByWalletAddress(userAddress);
  return user;
};

const addToSearchHistory = async (userAddress, tokenAddress, tokenName, symbol) => {
  try{
		const user = await getUserByWalletAddress(userAddress);
		if (!user) {
			throw new ApiError('User not found');
		}
		if(user.searchHistory.some(item => item.address === tokenAddress)) {
			throw new ApiError('Token already in search history');
		}else{
      user.searchHistory.push({
        address: tokenAddress,
        name: tokenName,
        symbol: symbol
      });
      await user.save();
      return user.searchHistory;
    }			
  	}catch(err) {
      throw new ApiError(err);
    }
};
  
const addToWatchlist = async (userAddress, tokenAddress, tokenName, symbol) => {
  try{
    const user = await getUserByWalletAddress(userAddress);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if(user.watchlist.some(item => item.address === tokenAddress)) {
      throw new ApiError('Token already in watchlist');
    }else{
      user.watchlist.push({
        address: tokenAddress,
        name: tokenName,
        symbol: symbol
      });
      await user.save();
      return user.watchlist;
    }    
  }catch(err) {
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
};

const removeFromWatchlist = async (userAddress, tokenAddress) => {
  try{
      const user = await getUserByWalletAddress(userAddress);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }
      let watchlist = user.watchlist.filter(item => item.address !== tokenAddress);
      user.watchlist = watchlist;
      await user.save();
      return user.watchlist;
  }catch(err){
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
}

const removeFromSearchHistory = async (userAddress, tokenAddress) => {
  try{
    const user = await getUserByWalletAddress(userAddress);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    let searchHistory = user.searchHistory.filter(item => item.address !== tokenAddress);
    user.searchHistory = searchHistory;
    await user.save();
    return user.searchHistory;
  }catch(err){
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
}

const getUserWatchlist = async (userAddress) => { 
  try{
    let user = await User.findOne({'address': userAddress}, {'watchlist': 1, '_id': 0});
    return user.watchlist;
  } catch(err) {
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
}

const getUserSearchHistory = async (userAddress) => { 
  try{
    let user = await User.findOne({'address': userAddress}, {'searchHistory': 1, '_id': 0});
    return user.searchHistory;
  } catch(err) {
    throw new ApiError(httpStatus.NOT_FOUND, err);
  }
}

module.exports = {
  createUser,
  userExists,
  getUserByAddress,
  addToSearchHistory,
  addToWatchlist,
  removeFromWatchlist,
  removeFromSearchHistory,
  getUserWatchlist,
  getUserSearchHistory
};
