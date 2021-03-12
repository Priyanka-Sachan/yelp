//Connecting to express
const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');

const expressSession = require('express-session');

const AppError = require('./utils/appError');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

const sessionConfig = {
    secret: 'thissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(expressSession(sessionConfig));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.send('<h1>WELCOME TO YELPCAMP!!!</h1>');
});

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