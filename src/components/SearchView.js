// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import $ from 'jquery';
import searchTemplate from '../templates/search.jst';
import ResultListView from './cardViews/ResultListView';
import ResultListEmptyView from './cardViews/ResultListEmptyView';

// The SDK used to talk to the MtG API
import mtg from 'mtgsdk';

export default Mn.View.extend({
  
  attributes: {class: 'search-cards'}, // Add this class to the view
  template: searchTemplate, // Use this template for our view
  
  regions: {
    // this is where our card list will appear
    resultsRegion: '.results'
  },
  
  events: {
    // We want to trigger the card search when the user submits the form
    "submit": "searchCards"
  },
  
  ui: {
    // Binds the form input to the ui variable
    // We can then grab it later without needing to use a DOM selector
    searchterm: "#search-term"
  },
  
  initialize() {
    // We don't actually show the card list yet, since it's empty, 
    // and we don't want to display the 'searching for cards' message yet.
    // We'll show it in the searchCards() function
  }, // end initialize
  
  searchCards(event) {
    
    // Prevent the default action, so we don't reload the page
    event.preventDefault();
    
    // Clear any previous results from the collection
    this.showChildView(
      'resultsRegion',
      new ResultListView({
      collection: new Backbone.Collection([])
    }));
    
    // We're going to go lookign for all cards which match the search term
    // But before we do, we're going to grab the list of our favourite cards, 
    // so that we can give them a button to un-favourite them
    var favouritesList = [];
    $.get({
      url:'/favourites/all',
      success: function(data){
        favouritesList = data;
      }
    });
    
    // This array will hold all of the cards from our current search
    var cardsList = [];
    
    // used to prevent duplicate cards from appearing in our list
    // We don't need a separate array for this, but it makes the code easier to work with
    var previousCards = [];
    
    // We use the MtG SDK to get all cards which match our search term
    // Note: If the search term is broad enough, we might miss cards
    // this is because the API only returns the first 100
    // This is most noticeable when searching for something like 'island'
    // The many printings of 'island' drown out cards like 'Island Fish Jasconius'
    // This deserves to be fixed, but it may require working outside the MtG SDK
    // As such, I'm leaving it for now.
    mtg.card.where({ name: this.ui.searchterm[0].value })
      .then(cards => {
      
        // we get back a list of cards which match the search term
        // we iterate the list and add each card to our model
        for(var i = 0; i < cards.length; i++) {
          
          // We ignore any cards without images (Usually promos or old printings)
          if(!cards[i].imageUrl)
            continue;
          
          // We only want to show one printing for each card
          // If a card appears multiple times, we ignore later occurrences
          if(previousCards.includes(cards[i].name))
            continue;
          previousCards.push(cards[i].name);
          
          // We need to do some extra work on the description field, so I do it here
          // That way, I don't clutter up the newCard declaration below
          var newDesc = "";
          if(cards[i].text)
            newDesc = cards[i].text.replace(/(?:\r\n|\r|\n)/g, '<br>'); // turn newlines into html breaks
          
          // We also give the card its favourite id, if it's in the db
          var newID = "";
          for(var j = 0; j < favouritesList.length; j++) {
            if(favouritesList[j].name === cards[i].name)
              newID = favouritesList[j]._id;
          }
              
          // We add the card to our list
          var newCard = {
            data: {
              name: cards[i].name,
              setName: cards[i].setName,
              type: cards[i].type,
              rarity: cards[i].rarity,
              image: cards[i].imageUrl,
              desc: newDesc,
              id: newID
            }
          }
          cardsList.push(newCard);
        }
          
        // If we've found no cards, we want to show a special message
        // Otherwise we show the card list
        if(cardsList.length > 0) {
          
          // We've finished adding all the cards to our list
          // Now we turn that list into a model and show the view with it
          this.showChildView(
            'resultsRegion',
            new ResultListView({
            collection: new Backbone.Collection(cardsList)
          }));
        } else {
          
          // No cards found! We display the message for this.
          this.showChildView(
            'resultsRegion',
            new ResultListEmptyView());
        }
      
    });
  } // end searchCards()
  
});