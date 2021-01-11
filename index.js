//Connecting to express
const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');

const Campground = require('./models/campground');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema } = require('./JoiSchema');

//Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/yelpCampDB', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('CONNECTED TO MONGODB');
    })
    .catch((e) => {
        console.log(`ERROR:${e}`);
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'); //View engine : ejs for templates here..
app.set('views', path.join(__dirname, 'views')); //To use views from anywhere in directory

app.use(express.static(path.join(__dirname, '/public'))); //For bootstrap/..

app.use(methodOverride('_method'));//making illusion of different method(get/post/put/..)

app.use(express.urlencoded({ extended: true })); //middleware used to parse url ?q=..
app.use(express.json());//to parse json

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

app.get('/', (req, res) => {
    res.send('<h1>WELCOME TO YELPCAMP!!!</h1>');
});

app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds)
        throw next(new AppError(404, 'Products Not Found'));
    res.render('campground/index', { campgrounds });
}));

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.patch('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = req.body.campground;
    console.log(campground);
    await Campground.findByIdAndUpdate(id, campground);
    res.redirect(`/campgrounds/${id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campground/new');
});

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // For errors returned from async functions invoked by route handlers & middlewares,
    //  you must pass them to the next() function, where EXpress will catch n process them...
    const campground = await Campground.findById(id);
    if (!campground)
        throw next(new AppError(404, 'Product Not Found'));
    res.render('campground/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    //instead of return, throw can also work here..
    if (!campground)
        throw next(new AppError(404, 'Product Not Found'));
    res.render('campground/edit', { campground });
}));

app.all('*', (req, res, next) => {
    next(new AppError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    if (!err.status)
        err.status = 500;
    if (!err.message)
        err.message = 'Something went wrong!!'
    res.status(err.status).render('error', { err });
});

//Listening to express
app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});