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

// Bootcamp Model
const Bootcamp = require('./models/Bootcamp');

// Connect to DataBase
mongoose.connect(process.env.MONGO_URI);

// Read Json files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import Data
const importData = async() => {
    try {
        await Bootcamp.create(bootcamps);

        console.log('Data imported to DataBase'.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err.message.red);
    }
};

// Delete Data
const deleteData = async() => {
    try {
        await Bootcamp.deleteMany();

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