const mongoose = require('mongoose');

const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelpCampDB', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log('CONNECTED TO MONGODB');
    })
    .catch((e) => {
        console.log(`ERROR:${e}`);
    });
const seedDB = async () => {
    await Campground.deleteMany({});
    try {
        for (let i = 0; i < 50; i++) {
            // const randomCity = Math.floor(Math.random * cities.length);
            // const randomDescriptor = Math.floor(Math.random * descriptors.length);
            // const randomPlace = Math.floor(Math.random * places.length);
            const randomCity = i;
            const randomDescriptor = i % 18;
            const randomPlace = i % 21;
            const campground = new Campground({
                images: [
                    {
                        url: 'https://res.cloudinary.com/dzvgb8onv/image/upload/v1615745487/yelpCamp/ohjfmszadxpby0nhsqrc.png',
                        filename: 'yelpCamp/ohjfmszadxpby0nhsqrc'
                    },
                    {
                        url: 'https://res.cloudinary.com/dzvgb8onv/image/upload/v1615745487/yelpCamp/wyakoai6oq40ogdqg7sh.png',
                        filename: 'yelpCamp/wyakoai6oq40ogdqg7sh'
                    }
                ],
                title: `${descriptors[randomDescriptor]} ${places[randomPlace]}`,
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, sapiente incidunt. Dolore explicabo voluptatum dignissimos error, id alias, quos modi provident ducimus impedit, facere ullam. Odio praesentium modi reprehenderit molestiae?",
                price: i * 400,
                location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
                author: '604d9df377cf1d9d00b95485'
            });
            console.log(campground);
            await campground.save();
        }
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

seedDB();

// seedDB().then(
//     mongoose.connection.close()
// );