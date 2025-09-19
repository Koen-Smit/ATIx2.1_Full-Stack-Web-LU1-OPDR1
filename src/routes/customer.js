var express = require('express');
var router = express.Router();

const customersController = require('../controllers/customer.controller');
const { requireAuth } = require('../utils/authMiddleware');

router.use(requireAuth);

// READ
router.get('/', customersController.get);

// Profile route
router.get('/:customerId', customersController.get);

// Profile route
router.get('/:customerId/profile', customersController.profile);

// UPDATE Profile
router.post('/:customerId/update', customersController.updateProfile);

// CREATE
router.post('/', customersController.create);

// DELETE
router.post('/:customerId/delete', customersController.delete);

// Catch-all voor ongeldige routes
router.get('*', (req, res) => {
    res.redirect('/customers');
});

module.exports = router;
