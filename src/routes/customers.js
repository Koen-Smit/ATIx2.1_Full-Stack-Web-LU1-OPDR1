var express = require('express');
var router = express.Router();

const customersController = require('../controllers/customersController');

// READ
router.get('/', customersController.get);
router.get('/:customerId', customersController.get);

// CREATE
router.post('/', customersController.create);

// UPDATE
router.post('/:customerId/update', customersController.validate, customersController.update);

// DELETE
router.post('/:customerId/delete', customersController.delete);

module.exports = router;
