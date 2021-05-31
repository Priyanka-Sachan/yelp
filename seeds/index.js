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
                        url: 'https://res.cloudinary.com/dzvgb8onv/image/upload/v1615791876/yelpCamp/mx8rhakez3lqz05k1izr.png',
                        filename: 'yelpCamp/mx8rhakez3lqz05k1izr'
                    },
                    {
                        url: 'https://res.cloudinary.com/dzvgb8onv/image/upload/v1615787000/yelpCamp/kiyd2bvcx6wuvg2r6jc6.jpg',
                        filename: 'yelpCamp/kiyd2bvcx6wuvg2r6jc6'
                    }
                ],
                title: `${descriptors[randomDescriptor]} ${places[randomPlace]}`,
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, sapiente incidunt. Dolore explicabo voluptatum dignissimos error, id alias, quos modi provident ducimus impedit, facere ullam. Odio praesentium modi reprehenderit molestiae?",
                price: i * 400,
                geometry: { type: 'Point', coordinates: [cities[randomCity].longitude, cities[randomCity].latitude] },
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