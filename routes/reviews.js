const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Campground = require('../models/campground');
const Review = require('../models/review');

const { isLoggedIn, isAuthor, isReviewAuthor, validateReview } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    console.log(campground);
    if (!campground)
        throw next(new AppError(404, 'Product Not Found'));
    req.flash('success', 'Successfully posted your review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;