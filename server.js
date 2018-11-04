// The structure of this node app is roughly based upon this tutorial by Eslam Maged
// https://codeburst.io/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb

// we start by including all our dependencies
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const favourites = require('./routes/favourites.route.js'); // import routes for favourites

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://mtgfavs_dbu:Tgds6naw34xsGVw@ds237979.mlab.com:37979/mtgfavs_db';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// parse application/x-www-form-urlencoded and json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/favourites', favourites); // add the favourites routes

app.listen(3000); // start listening on port 3000
console.log('Server running at http://127.0.0.1:3000/');

// serve the main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// serve the javascript file built by webpack
app.get('/core.js', (req, res) => {
  res.sendFile(__dirname + '/dist/core.js');
});