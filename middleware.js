const Campground = require('./models/campground');

const AppError = require('./utils/appError');

const { campgroundSchema, reviewSchema } = require('./JoiSchema');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // store their requested url
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are not signed in!');
        res.redirect('/login');
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground does not exist.');
        res.redirect('/campgrounds');
    }
    else if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do this.');
        res.redirect(`/campgrounds/${id}`);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Review does not exist.');
        res.redirect(`/campgrounds/${id}`);
    }
    else if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do this.');
        res.redirect(`/campgrounds/${id}`);
    }
    else {
        next();
    }
}

//Middleware to validate campground data
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(err => err.message).join(',');
        console.log('alidate rror');
        throw new AppError(400, message);
    }
    else
        next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(err => err.message).join(',');
        throw new AppError(400, message);
    }
    else
        next();
}