const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    images: [
        {
            url: String,
            filename: String,
        }
    ],
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        await Review.deleteMany({
            _id: {
                $in: campground.reviews
            }
        });
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);