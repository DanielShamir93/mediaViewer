const route = require('express').Router();
const storage = require('../middleware/multer');
const controller = require('./controller');
const bodyParser = require('body-parser');

// routes

// gets the media from MongoDB and redirect to /main.ejs
route.get('/', controller.home);


let urlencodedParser = bodyParser.urlencoded({ extended: true });
route.post('/remove-media', urlencodedParser, controller.remove);

// uploads the media to MongoDB and redirect to /upload-media and return the data to the user
route.post('/upload-media', storage.array('media'), controller.uploads);

module.exports = route;