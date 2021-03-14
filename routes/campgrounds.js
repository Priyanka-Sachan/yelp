const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds)
        throw next(new AppError(404, 'Page Not Found'));
    res.render('campground/index', { campgrounds });
}));

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campground/new');
});

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // For errors returned from async functions invoked by route handlers & middlewares,
    //  you must pass them to the next() function, where EXpress will catch n process them...
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground does not exist.');
        res.redirect('/campgrounds');
    }
    res.render('campground/show', { campground });
}));

router.patch('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground.');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
}));

module.exports = router;