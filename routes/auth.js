// Express
const express = require('express');
const router = express.Router();
const { register } = require('../controllers/auth');

// Routes
router.post('/register', register);

module.exports = router;