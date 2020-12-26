//Connecting to express
const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

const methodOverride = require('method-override');

const ejsMate = require('ejs-mate');

const Campground = require('./models/campground');

//Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/yelpCampDB', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
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

app.get('/', (req, res) => {
    res.send('<h1>WELCOME TO YELPCAMP!!!</h1>');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds });
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    try {
        await campground.save();
        console.log(campground);
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        res.status(404).send(`STATUS 404: NOT FOUND`);
    }
});

app.patch('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = req.body.campground;
    console.log(campground);
    await Campground.findByIdAndUpdate(id, campground);
    res.redirect(`/campgrounds/${id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campground/new');
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const campground = await Campground.findById(id);
        //console.log(...campground);
        //console.log({...campground});
        res.render('campground/show', { campground });
    } catch (e) {
        res.status(404).send(`STATUS 404: NOT FOUND`);
    }
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
});

//Listening to express
app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});