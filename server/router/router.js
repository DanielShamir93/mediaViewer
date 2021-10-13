const route = require('express').Router();
const store = require('../middleware/multer');
const controller = require('./controller');
const bodyParser = require('body-parser');

// routes

// gets the media from MongoDB and redirect to /main.ejs
route.get('/', controller.home);

// remove records from MongoDB
route.post('/remove-media', controller.remove);

// update record on MongoDB
route.post('/update-media', controller.update)

// uploads the media to MongoDB and redirect to /upload-media and return the data to the user
route.post('/upload-media', store.array('upload-media'), controller.uploads);

module.exports = route;