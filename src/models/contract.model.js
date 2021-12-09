const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const contractSchema = mongoose.Schema(
  {
    contractABI: {
      type: JSON,
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
contractSchema.plugin(toJSON);
contractSchema.plugin(paginate);

/**
 * @typedef Contract
 */
const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
