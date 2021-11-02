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

router.get('/', getBootcamps);
router.post('/', createBootcamp);
router.get('/:id', getBootcamp);
router.put('/:id', updateBootcamp);
router.delete('/:id', deleteBootcamp);
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;