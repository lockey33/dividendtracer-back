const express = require('express');
const contractController = require('../../controllers/contract.controller');

const router = express.Router();

router.get('/find/:tokenAddress', contractController.getContractByAddress);
router.post('/create', contractController.createContract);

module.exports = router;
