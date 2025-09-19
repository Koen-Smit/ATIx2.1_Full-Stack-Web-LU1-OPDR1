var express = require('express');
var router = express.Router();

const filmsController = require('../controllers/film.controller');
const { requireAuth } = require('../utils/authMiddleware');

router.use(requireAuth);

// READ
router.get('/', filmsController.get);

// READ
router.get('/:filmId', filmsController.get);

// CREATE
router.post('/:filmId/rent', filmsController.createRental);

// Catch-all
router.get('*', (req, res) => {
    res.redirect('/films');
});

module.exports = router;