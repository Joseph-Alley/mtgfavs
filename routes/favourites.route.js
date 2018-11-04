// include dependencies
const express = require('express');
const router = express.Router();

// Require the controller
const favourites_controller = require('../controllers/favourites.controller');

// Submit a favourite card to the database
router.post('/submit', favourites_controller.submit);

// Get a list of favourite cards
router.get('/all', favourites_controller.get_all);

// Remove a card from the favourites list
router.delete('/:id/delete', favourites_controller.delete);

// export the routes
module.exports = router;