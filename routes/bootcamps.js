// Express Router
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
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
router.post('/', protect, authorize('publisher', 'admin'), createBootcamp);
router.get('/:id', getBootcamp);
router.put('/:id', protect, authorize('publisher', 'admin'), updateBootcamp);
router.put(
    '/:id/photo',
    protect,
    authorize('publisher', 'admin'),
    bootcampPhotoUpload
);
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteBootcamp);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;