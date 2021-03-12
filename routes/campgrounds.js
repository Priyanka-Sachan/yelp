const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Campground = require('../models/campground');

const { campgroundSchema } = require('../JoiSchema');

//Middleware to validate campground data
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(err => err.message).join(',');
        throw new AppError(400, message);
    }
    else
        next();
}

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds)
        throw next(new AppError(404, 'Products Not Found'));
    res.render('campground/index', { campgrounds });
}));

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.patch('/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = req.body.campground;
    console.log(campground);
    await Campground.findByIdAndUpdate(id, campground);
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

router.get('/new', (req, res) => {
    res.render('campground/new');
});

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // For errors returned from async functions invoked by route handlers & middlewares,
    //  you must pass them to the next() function, where EXpress will catch n process them...
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground)
        throw next(new AppError(404, 'Product Not Found'));
    res.render('campground/show', { campground });
}));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //instead of return, throw can also work here..
    if (!campground)
        throw next(new AppError(404, 'Product Not Found'));
    res.render('campground/edit', { campground });
}));

module.exports = router;