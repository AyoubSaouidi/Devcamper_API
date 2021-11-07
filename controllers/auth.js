// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// User Model
const User = require('../models/User');

// @desc     Register User
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async(req, res, next) => {
    // Body data
    const { name, email, password, role } = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Response
    res.status(200).json({
        success: true,
        data: user
    });
});