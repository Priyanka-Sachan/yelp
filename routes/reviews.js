const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../JoiSchema');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(err => err.message).join(',');
        throw new AppError(400, message);
    }
    else
        next();
}

router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    console.log(campground);
    if (!campground)
        throw next(new AppError(404, 'Product Not Found'));
    req.flash('success', 'Successfully posted your review!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;