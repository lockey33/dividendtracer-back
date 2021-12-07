const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const trendingSchema = mongoose.Schema(
  {
    increment: {
      type: Number,
      required: true,
      trim: true,
    },
    tokenAddress: String,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
trendingSchema.plugin(toJSON);
trendingSchema.plugin(paginate);

/**
 * @typedef TrendingTokens
 */
const TrendingTokens = mongoose.model('User', trendingSchema);

module.exports = TrendingTokens;
