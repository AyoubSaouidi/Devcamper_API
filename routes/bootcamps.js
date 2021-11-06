// Express Router
const express = require('express');
const router = express.Router();
const {
    getBootcamps,
    getBootcampsInRadius,
    getBootcamp,
    createBootcamp,
    bootcampPhotoUpload,
    updateBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps');
// Advanced Results for Pgination, Selecting, Filtering and Sorting ( Bootcamp )
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const coursesRouter = require('./courses');

// Re-route (Mount) to other resource router
router.use('/:bootcampId/courses', coursesRouter);

// Routes
router.get('/', advancedResults(Bootcamp, 'courses'), getBootcamps);
router.post('/', createBootcamp);
router.get('/:id', getBootcamp);
router.put('/:id', updateBootcamp);
router.put('/:id/photo', bootcampPhotoUpload);
router.delete('/:id', deleteBootcamp);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;