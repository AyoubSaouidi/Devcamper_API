// Express Router
const express = require('express');
const router = express.Router();
const {
    getBootcamps,
    getBootcampsInRadius,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps');

// Include other resource router
const coursesRouter = require('./courses');

// Re-route (Mount) to other resource router
router.use('/:bootcampId/courses', coursesRouter);

// Routes
router.get('/', getBootcamps);
router.post('/', createBootcamp);
router.get('/:id', getBootcamp);
router.put('/:id', updateBootcamp);
router.delete('/:id', deleteBootcamp);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;