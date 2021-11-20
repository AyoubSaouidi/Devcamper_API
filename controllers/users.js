// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// User Model
const User = require('../models/User');

// @desc     Get all users
// @route    GET /api/v1/users
// @access   Private/admin
exports.getUsers = asyncHandler(async(req, res, next) => {
    // Response
    res.status(200).json(res.advancedResults);
});

// @desc     Get single user
// @route    GET /api/v1/users/:id
// @access   Private/admin
exports.getUser = asyncHandler(async(req, res, next) => {
    // Search User by Id from database
    const user = await User.findById(req.params.id);

    // No User found Response
    if (!user)
        return next(
            new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );

    // Found Response
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc     Create user
// @route    POST /api/v1/users
// @access   Private/admin
exports.createUser = asyncHandler(async(req, res, next) => {
    // Body data
    const { name, email, password, role } = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Found Response
    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc     Update user
// @route    PUT /api/v1/users/:id
// @access   Private/admin
exports.updateUser = asyncHandler(async(req, res, next) => {
    // Search User by Id from database and Update
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Found Response
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc     Delete user
// @route    DELETE /api/v1/users/:id
// @access   Private/admin
exports.deleteUser = asyncHandler(async(req, res, next) => {
    // Search User by Id from database And Delete
    await User.findByIdAndDelete(req.params.id);

    // Found Response
    res.status(200).json({
        success: true,
        data: {}
    });
});