// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }
require('dotenv').config();
//Connecting to express
const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');

const expressSession = require('express-session');

const flash = require('connect-flash');

const passport = require('passport');
const localStrategy = require('passport-local');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const AppError = require('./utils/appError');

const User = require('./models/user');

const users = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const { session } = require('passport');

const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpCampDB';

//Connecting to mongoose
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
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

const secret = process.env.SECRET || 'thissecret';
const store = new MongoDBStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});
const sessionConfig = {
    store: store,
    name: 'coco',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(expressSession(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));
// or configure contentSecurityPolicy 

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', users);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new AppError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    if (!err.status)
        err.status = 500;
    if (!err.message)
        err.message = 'Something went wrong!!'
    req.flash('error', `ERROR: ${err.status}\n ${err.message}`);
    res.redirect('/campgrounds/');
    //res.status(err.status).render('error', { err });
});

//Listening to express
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`);
});