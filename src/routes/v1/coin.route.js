const express = require('express');
const coinController = require('../../controllers/coin.controller');

const router = express.Router();

router.get('/find/:coinAddress/:wallet', coinController.getCoin);
router.post('/create', coinController.createCoin);
router.get('/trendingCoins', coinController.getTrendingCoins);


module.exports = router;
