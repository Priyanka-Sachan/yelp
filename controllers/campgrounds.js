const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Campground = require('../models/campground');

module.exports.index = catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds)
        throw next(new AppError(404, 'Page Not Found'));
    res.render('campground/index', { campgrounds });
});

module.exports.newCampgroundForm = (req, res) => {
    res.render('campground/new');
}

module.exports.newCampground = catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.showCampground = catchAsync(async (req, res, next) => {
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
});

module.exports.updateCampgroundForm = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
});

module.exports.updateCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground.');
    res.redirect(`/campgrounds/${id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
});

