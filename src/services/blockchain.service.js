const ethers = require('ethers');
const config = require('../../config.json');
const ERC20 = require('../abi/ERC20.json');
const contract = require('../utils/contract');
const {createRewardCoin} = require("./coin.service");

const addresses = {
  WBNB: ethers.utils.getAddress('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'),
  factory: ethers.utils.getAddress('0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'),
  router: ethers.utils.getAddress('0x10ED43C718714eb63d5aA57B78B54704E256024E'),
};

const provider = new ethers.providers.WebSocketProvider('wss://bsc-ws-node.nariox.org:443');
const wallet = new ethers.Wallet(config.privateKey);
const account = wallet.connect(provider);
const factory = new ethers.Contract(
  addresses.factory,
  ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
  account
);

const listenRewardCoins = async () => {
  //await createRewardCoin("0x54626300818e5c5b44db0fcf45ba4943ca89a9e2","CHECOIN") test
  factory.on('PairCreated', async (token0, token1, pairAddress) => {
    try{

      if(typeof token0 === 'undefined' || token1 === 'undefined'){
        return;
      }

      token0 = ethers.utils.getAddress(token0);
      token1 = ethers.utils.getAddress(token1);
      let tokenIn, tokenOut;

      if(token0 === addresses.WBNB) {
        tokenIn = token0;
        tokenOut = token1;
      }

      if(token1 === addresses.WBNB) {
        tokenIn = token1;
        tokenOut = token0;
      }

      let tokenInName = await contract.getTokenName(tokenIn);
      let tokenOutName = await contract.getTokenName(tokenOut);


      let checkIfRewardToken = await contract.checkRewardToken(tokenOut)

      if(checkIfRewardToken === true) {
        await createRewardCoin(tokenOut,tokenOutName)
      }
      //console.log(tokenOutName, checkIfRewardToken)
      //The quote currency is not WBNB

    }catch(err){
      console.log(err)
    }


  });
  return "Listening...";
}

module.exports = {
  listenRewardCoins,
};
