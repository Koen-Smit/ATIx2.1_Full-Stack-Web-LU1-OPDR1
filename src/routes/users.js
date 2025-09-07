var express = require('express');
var router = express.Router();

const usersController = require('../controllers/usersController');

router.get('/', usersController.get);
router.get('/:userId', usersController.get);
router.post('/:userId', usersController.delete);

module.exports = router;
