// Express
const express = require('express');
const router = express.Router({ mergeParams: true });
// controllers
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users');
// Protect middlewares
const { authorize, protect } = require('../middleware/auth');
// Advanced Results (Filtering)
const advancedResults = require('../middleware/advancedResults');
// Model
const User = require('../models/User');

// Protect Route && Admin
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', advancedResults(User), getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;