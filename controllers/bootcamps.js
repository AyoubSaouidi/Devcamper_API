// Error Response
const ErrorResponse = require('../utils/errorResponse');
// Async Middleware Handler
const asyncHandler = require('../middleware/async');
// Geocoder
const geocoder = require('../utils/geocoder');
// Bootcamp Model
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
    // Request Query
    let queryString = JSON.stringify(req.query);

    // Add '$' in front of the operation key
    queryString = queryString.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    console.log(queryString.yellow);

    // QUERY
    console.log(JSON.parse(queryString));
    const query = Bootcamp.find(JSON.parse(queryString));

    // Fetch Bootcamps from DataBase
    const bootcamps = await query;

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

// @desc     Get bootcamps within a radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Public
exports.getBootcampsInRadius = asyncHandler(async(req, res, next) => {
    // Params deconstructoring
    const { zipcode, distance } = req.params;

    // Get location (long, lat)
    const location = await geocoder.geocode(zipcode);
    const latitude = location[0].latitude;
    const longitude = location[0].longitude;

    // Calculating Radius using radians
    // Deviding distance by Radius of Earth
    // Radius of Earth = 3,963 miles or 6,378 kilometers
    const radius = distance / 6378; // Kilometer

    // Find Bootcamps in radius
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [longitude, latitude], radius
                ]
            }
        }
    });

    // Response
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
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