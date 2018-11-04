// get dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema for our favourites
let FavouriteSchema = new Schema({
    name: {type: String, required: true, unique: true}
});

// Export the model
module.exports = mongoose.model('Favourite', FavouriteSchema);