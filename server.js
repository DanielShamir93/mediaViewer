const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const path = require('path');
const port = 3000;

// make row json data using post request 
app.use(express.json());

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// connect mongodb database
const mongodbPath = 'server/database/mongodb';
const connectToMongodb = require(path.join(__dirname, mongodbPath));
connectToMongodb();

// setup view engine
app.set('view engine', 'ejs');

// calling routes
const routerPath = './server/router/router';
const router = require(path.join(__dirname, routerPath));
app.use('/', router);

// start listen to server
app.listen(port, '0.0.0.0', () => console.log(`server is started on port: ${ port }`));

