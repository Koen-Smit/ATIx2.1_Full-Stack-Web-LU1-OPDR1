var express = require('express');
var router = express.Router();

const customersController = require('../controllers/customersController');

router.get('/', customersController.get);
router.get('/:customerId', customersController.get);
router.post('/:customerId', customersController.delete);

module.exports = router;
