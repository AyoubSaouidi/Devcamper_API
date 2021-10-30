const colors = require('colors');
// Bootcamp Model
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = async(req, res, next) => {
    try {
        // Fetch Bootcamps from DataBase
        const bootcamps = await Bootcamp.find();

        // Response
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        // ERROR
        console.log(err.message.red);
        res.status(400).json({
            success: true
        });
    }
};

// @desc     Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = async(req, res, next) => {
    try {
        // Fetch Bootcamp by ID from DataBase
        const bootcamp = await Bootcamp.findById(req.params.id);

        // no Bootcamp found Response
        if (!bootcamp)
            return res.status(400).json({
                success: false
            });

        // Bootcamp found Response
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        // ERROR
        console.error(err.message.red);
        res.status(400).json({
            success: false
        });
    }
};

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createBootcamp = async(req, res, next) => {
    try {
        // Add Bootcamp to DataBase
        const bootcamp = await Bootcamp.create(req.body);

        // Response
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        // ERROR
        console.log(err.message.red);
        res.status(400).json({
            success: false
        });
    }
};

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = async(req, res, next) => {
    try {
        // Fetch Bootcamp by ID from Database and Update it
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // no Bootcamp found Response
        if (!bootcamp)
            return res.status(400).json({
                success: false
            });

        // Bootcamp found Response
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        // ERROR
        console.error(err.message.red);
        res.status(400).json({
            success: false
        });
    }
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = async(req, res, next) => {
    try {
        // Fetch Bootcamp by ID from Database and Update it
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        // no Bootcamp found Response
        if (!bootcamp)
            return res.status(400).json({
                success: false
            });

        // Bootcamp found Response
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        // ERROR
        console.error(err.message.red);
        res.status(400).json({
            success: false
        });
    }
};