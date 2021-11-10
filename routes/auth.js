// Express
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    forgotPassword
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Routes
router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);

module.exports = router;