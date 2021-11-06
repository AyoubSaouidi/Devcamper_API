// Path
const path = require('path');
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
    // Response
    res.status(200).json(res.advancedResults);
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
    const bootcamp = await Bootcamp.findById(req.params.id);

    // No Bootcamp found Response
    if (!bootcamp)
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );

    // Remove from DataBase
    bootcamp.remove();

    // Bootcamp found Response
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc     Upload photo for bootcamp
// @route    PUT /api/v1/bootcamps/:id/photo
// @access   Private
exports.bootcampPhotoUpload = asyncHandler(async(req, res, next) => {
    // Fetch Bootcamp by ID from Database and Update it
    const bootcamp = await Bootcamp.findById(req.params.id);

    // No Bootcamp found Response
    if (!bootcamp)
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );

    // No File uploaded
    if (!req.files) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const file = req.files.file;
    // File is not Image
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image file', 400));
    }
    // File Size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload a file less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Create unique File name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    // Move the file to the Uploads Directory --> ./public/uploads
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async(err) => {
        // ERROR
        if (err) {
            console.error(err.message.red.bold);
            return next(new ErrorResponse('Probleme with file upload', 500));
        }

        // Update photo field of Bootcamp in database
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        // Response
        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});