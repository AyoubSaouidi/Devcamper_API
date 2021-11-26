# DevCamper API

> Backend API for DevCamper application, which is a bootcamp directory website.

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own.

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Seeding Mock Data

There's fake data of ressources in "\_data/":

- users.json
- bootcamps.json
- courses.json
- reviews.json

You can test the API with 'seeder.js' by inserting and deleting once before running server.

```
# Insert data
node seeder -i

# Delete data
node seeder -d
```

## Roles

By default there's 3 roles 'user','publisher' and 'admin'. To be 'admin', you need to change the role manually via MongoDB-Atlas or Compass.

## API Documentation

Read more about the API features in this [Documentation](https://devcamper-learn.me).

#

- Version: 1.0.0
- License: MIT
- Author: Ayoub Saouidi
