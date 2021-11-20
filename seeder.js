// Mongoose
const mongoose = require('mongoose');
// DotEnv
const dotenv = require('dotenv');
// File System
const fs = require('fs');
// Colors
const colors = require('colors');

// Dot Env
dotenv.config({ path: `${__dirname}/config/config.env` });

// Models
const User = require('./models/User');
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const Review = require('./models/Review');

// Connect to DataBase
mongoose.connect(process.env.MONGO_URI);

// Read Json files
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import Data
const importData = async() => {
    try {
        await User.create(users);
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await Review.create(reviews);

        console.log('Data imported to DataBase'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err.message.red);
    }
};

// Delete Data
const deleteData = async() => {
    try {
        await User.deleteMany();
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await Review.deleteMany();

        console.log('Data deleted from DataBase'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err.message.red);
    }
};

// SCRIPTS
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}