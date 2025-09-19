var express = require('express');
var router = express.Router();

const authController = require('../controllers/auth.controller');

// GET login page
router.get('/login', authController.getLogin);

// POST login
router.post('/login', authController.postLogin);

// GET register page
router.get('/register', authController.getRegister);

// POST register
router.post('/register', authController.postRegister);

// POST logout
router.post('/logout', authController.logout);

// GET profile page
router.get('/profile', authController.getProfile);

// POST activate account
router.post('/activate', authController.postActivateAccount);

// POST edit profile
router.post('/edit-profile', authController.postEditProfile);

module.exports = router;