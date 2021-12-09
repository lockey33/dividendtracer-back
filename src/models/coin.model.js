const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const CoinSchema = mongoose.Schema(
  {
    increment: {
      type: Number,
      required: true,
      trim: true,
    },
    wallet: String,
    tokenAddress: String,
    globalReward: Number,
    todayReward: Number,
    globalRewardDollar: String,
    todayRewardDollar: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
CoinSchema.plugin(toJSON);
CoinSchema.plugin(paginate);

/**
 * @typedef Coin
 */
const Coin = mongoose.model('Coin', CoinSchema);

module.exports = Coin;
