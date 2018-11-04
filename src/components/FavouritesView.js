// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import $ from 'jquery';
import favouritesTemplate from '../templates/favourites.jst';
import ResultListView from './cardViews/ResultListView';

// The SDK used to talk to the MtG API
import mtg from 'mtgsdk';

export default Mn.View.extend({
  
  attributes: {class: 'favourites'}, // Add this class to the view
  template: favouritesTemplate, // Use this template for our view
  
  regions: {
    // this is where our card list will appear
    resultsRegion: '.results'
  },
  
  initialize() {
    
    // We start with an empty collection
    this.showChildView(
      'resultsRegion',
      new ResultListView({
      collection: new Backbone.Collection([])
    }));
    
    // We also set an empty list which we will use to hold the favourited cards
    this.cardsList = [];
    
    // We're going to go lookign for all favourited cards
    // We grab the list from our db, then search for each card individually
    // Most of this happens in the findMatchingCards() function below
    var self = this;
    $.get({
      url:'/favourites/all',
      success: function(data){
        self.findMatchingCards(data);
      }
    });    
  }, // end initialize()
  
  // This function takes a list of favourited cards, then goes and finds each card
  // It then adds each card to the collection
  findMatchingCards(favouritesList) {
    
    // Loop through each of our favourites. For each one, find the card using the MTG API
    for(let i = 0; i < favouritesList.length; i++) {
      mtg.card.where({ name: favouritesList[i].name })
        .then(cards => {

          // we get back a list of cards which match the search term
          // we iterate the list and add the first matching card to our model.
          for(var j = 0; j < cards.length; j++) {

            // We ignore any cards without images (Usually promos or old printings)
            if(!cards[j].imageUrl)
              continue;

            // If the name matches exactly, we add it to the list
            if(favouritesList[i].name === cards[j].name) {
              
              // We need to do some extra work on the description field, so I do it here
              // That way, I don't clutter up the newCard declaration below
              var newDesc = "";
              if(cards[j].text)
                newDesc = cards[j].text.replace(/(?:\r\n|\r|\n)/g, '<br>'); // turn newlines into html breaks

              // We've found this card, so we add it to the list
              var newCard = {
                data: {
                  name: cards[j].name,
                  setName: cards[j].setName,
                  type: cards[j].type,
                  rarity: cards[j].rarity,
                  image: cards[j].imageUrl,
                  desc: newDesc,
                  id: favouritesList[i]._id
                }
              }
              this.cardsList.push(newCard);
    
              // We show the card list, with the extra card added
              this.showChildView(
                'resultsRegion',
                new ResultListView({
                collection: new Backbone.Collection(this.cardsList)
              }));
              
              // We've found the card we're looking for, and break the loop
              break; 
            } 
          } // end mtg API call
      });
    } // end outer loop on favourite card list
  }
  
});