const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  return User.create(userBody);
};

const userExists = async (userAddress) => {
  const user = await User.findOne({ address: userAddress });
  console.log(user);
  return !!user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByWalletAddress = async (userAddress) => {
  return User.findOne({ address: userAddress });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Get user by address
 * @param {ObjectId} userAddress
 * @returns {Promise<User>}
 */
const getUserByAddress = async (userAddress) => {
  const user = await getUserByWalletAddress(userAddress);
  return user;
};

const addToSearchHistory = async (userAddress, tokenAddress, tokenName, symbol) => {
  const user = await getUserByWalletAddress(userAddress);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // pas besoin d'en sortir une erreur, si ça existe déjà tant mieux
  /*  if(user.searchHistory.some(item => item.address === tokenAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token already in search history');
  } */
  user.searchHistory.push({
    address: tokenAddress,
    name: tokenName,
    symbol,
  });
  await user.save();
  return user.searchHistory;
};

const addToWatchlist = async (userAddress, tokenAddress, tokenName, symbol) => {
  const user = await getUserByWalletAddress(userAddress);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.watchlist.some((item) => item.address === tokenAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token already in watchlist');
  }
  user.watchlist.push({
    address: tokenAddress,
    name: tokenName,
    symbol,
  });
  await user.save();
  return user.watchlist;
};

const removeFromWatchlist = async (userAddress, tokenAddress) => {
  const user = await getUserByWalletAddress(userAddress);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const watchlist = user.watchlist.filter((item) => item.address !== tokenAddress);
  user.watchlist = watchlist;
  await user.save();
  return user.watchlist;
};

const removeFromSearchHistory = async (userAddress, tokenAddress) => {
  const user = await getUserByWalletAddress(userAddress);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const searchHistory = user.searchHistory.filter((item) => item.address !== tokenAddress);
  user.searchHistory = searchHistory;
  await user.save();
  return user.searchHistory;
};

const getUserWatchlist = async (userAddress) => {
  try {
    const user = await User.findOne({ address: userAddress }, { watchlist: 1, _id: 0 });
    return user.watchlist;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

const getUserSearchHistory = async (userAddress) => {
  try {
    const user = await User.findOne({ address: userAddress }, { searchHistory: 1, _id: 0 });
    return user.searchHistory;
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};

//TODO créer nouvel objet reward si il existe pas,ou update celui qui existe déjà
const updateRewards = async (userAddress, coin) => {
  const user = await User.findOne({ address: userAddress });
  user.rewards = { tokenAddress: coin.tokenAddress, globalReward: coin.globalReward, todayReward: coin.todayReward };
  user.save();
};

module.exports = {
  createUser,
  userExists,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByAddress,
  addToSearchHistory,
  addToWatchlist,
  removeFromWatchlist,
  removeFromSearchHistory,
  getUserWatchlist,
  getUserSearchHistory,
  updateRewards,
};
