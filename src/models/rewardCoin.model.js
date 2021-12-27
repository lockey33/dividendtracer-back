const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const RewardCoinSchema = mongoose.Schema(
  {
    tokenAddress: String,
    name: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
RewardCoinSchema.plugin(toJSON);
RewardCoinSchema.plugin(paginate);

/**
 * @typedef Coin
 */
const Coin = mongoose.model('RewardCoin', RewardCoinSchema);

module.exports = Coin;
