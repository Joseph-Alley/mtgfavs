// get the model used for inserting Favourites into the db
const Favourite = require('../models/favourites.model');

// This function submits a new favourite to the db
exports.submit = function (req, res) {  
  
  // create our new favourite object
  let favourite = new Favourite(
    {
      name: req.body.cardName
    }
  );
  
  // save the new object into the db
  favourite.save(function (err) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate card name, meaning that this card has already been favourited.
        return res.status(500).send({ succes: false, message: 'Card is already a favourite!' });
      }

      // Some other error
      return res.status(500).send(err);
    }
    
    // we return the id so that the front-end app can save it, and later un-favourite the card if needed.
    res.send({ status: 'SUCCESS', id: favourite._id });
  })
};

// Get a list of all favourited cards
exports.get_all = function (req, res) {  
  
  // get the full list of saved favourites
  Favourite.find({}, function(err, favourites) {
    res.send(favourites);
  });
};

// Delete a favourite from the db, given that favourite's id
exports.delete = function (req, res) {  
  
  // Delete the favourite using its id
  Favourite.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.send('Deleted successfully!');
  })
};