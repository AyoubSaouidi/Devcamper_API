// Express
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Routes
router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);

module.exports = router;