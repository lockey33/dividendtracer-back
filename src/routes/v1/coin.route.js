const express = require('express');
const coinController = require('../../controllers/coin.controller');

const router = express.Router();

router.get('/find/:coinAddress/:wallet', coinController.getCoin);
router.post('/create', coinController.createCoin);

module.exports = router;
