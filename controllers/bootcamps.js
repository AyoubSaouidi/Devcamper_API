// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// Bootcamp Model
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
    // Fetch Bootcamps from DataBase
    const bootcamps = await Bootcamp.find();

    // Response
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc     Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = asyncHandler(async(req, res, next) => {
    // Fetch Bootcamp by ID from DataBase
    const bootcamp = await Bootcamp.findById(req.params.id);

    // No Bootcamp found Response
    if (!bootcamp)
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );

    // Bootcamp found Response
    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = asyncHandler(async(req, res, next) => {
    // Add Bootcamp to DataBase
    const bootcamp = await Bootcamp.create(req.body);

    // Response
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
    // Fetch Bootcamp by ID from Database and Update it
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // No Bootcamp found Response
    if (!bootcamp)
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );

    // Bootcamp found Response
    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = asyncHandler(async(req, res, next) => {
    // Fetch Bootcamp by ID from Database and Update it
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    // No Bootcamp found Response
    if (!bootcamp)
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );

    // Bootcamp found Response
    res.status(200).json({
        success: true,
        data: {}
    });
});