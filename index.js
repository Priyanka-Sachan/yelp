//Connecting to express
const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

const methodOverride = require('method-override');

//Connecting to mongoose
mongoose.connect('mongodb://localhost:27017/redditDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('CONNECTED TO MONGODB');
    })
    .catch((e) => {
        console.log(`ERROR:${e}`);
    });

app.set('view engine', 'ejs'); //View engine : ejs for templates here..
app.set('views', path.join(__dirname, 'views')); //To use views from anywhere in directory

app.use(express.static(path.join(__dirname, '/public'))); //For bootstrap/..

app.use(methodOverride('_method'));//making illusion of different method(get/post/put/..)

app.use(express.urlencoded({ extended: true })); //middleware used to parse url ?q=..
app.use(express.json());//to parse json

//Listening to express
app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000');
});