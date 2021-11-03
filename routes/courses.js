// Express
const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse } = require('../controllers/courses');

// Routes
router.get('/', getCourses);
router.get('/:id', getCourse);

module.exports = router;