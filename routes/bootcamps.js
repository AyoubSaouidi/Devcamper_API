// Express Router
const express = require('express');
const router = express.Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps');

router.get('/', getBootcamps);
router.get('/:id', getBootcamp);
router.post('/', createBootcamp);
router.put('/:id', updateBootcamp);
router.delete('/:id', deleteBootcamp);

module.exports = router;