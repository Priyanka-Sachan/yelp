const express = require('express');
const router = express.Router();

const { storage } = require('../cloudinary');

const multer = require('multer');
const upload = multer({ storage });

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('images'), validateCampground, campgrounds.newCampground);

router.get('/new', isLoggedIn, campgrounds.newCampgroundForm);

router.route('/:id')
    .get(campgrounds.showCampground)
    .patch(isLoggedIn, isAuthor, upload.array('images'), validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.updateCampgroundForm);

module.exports = router;