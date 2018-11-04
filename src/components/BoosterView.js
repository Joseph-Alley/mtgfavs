// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import $ from 'jquery';
import boosterTemplate from '../templates/booster.jst';
import setPickerTemplate from '../templates/setpicker.jst';
import ResultListSimpleView from './cardViews/ResultListSimpleView';
import BoosterEmptyView from './cardViews/BoosterEmptyView';

// The SDK used to talk to the MtG API
import mtg from 'mtgsdk';

export default Mn.View.extend({
  
  attributes: {class: 'gen-booster'}, // Add this class to the view
  template: boosterTemplate, // Use this template for our view
  
  regions: {
    setPickerRegion: '.set-picker-wrap', // We insert our dynamically-generated select input here
    showBoosterRegion: '.results' // this is where our card list will appear
  },
  
  events: {
    // We want to generate the booster when the user submits the form
    "submit": "generateBooster"
  },
  
  ui: {
    // Binds the form input to the ui variable
    // We can then grab it later without needing to use a DOM selector
    selectSetID: "#select-set-id"
  },
  
  initialize() {
    
    // Set up the set picker
    var SelectView = Mn.View.extend({
      tagName: "select",
      id: 'select-set-id',
      template: setPickerTemplate
    });

    // We instantiate the select view with empty data
    var setPicker = new SelectView({
      collection: new Backbone.Collection([
        { data: {setName: "Loading Sets...", setCode: ""}}
      ])
    });

    // We show the view in the appropriate region
    this.showChildView('setPickerRegion', setPicker);
    
    // rebind the UI elements, now that we've added a new select field
    this.bindUIElements();
    
    // Get the set list from the MtG API
    mtg.set.where({})
    .then(sets => {
      
      // we iterate the returned sets, and add each to our set list
      var setList = [];
      for(var i = 0; i < sets.length; i++) {
        var newSet = {
          data: {
            setName: sets[i].name,
            setCode: sets[i].code
          }
        }
        setList.push(newSet);
      }
      
      // Once we've got all the sets, we reset the select view with the new data
      var setPicker = new SelectView({
        collection: new Backbone.Collection(setList)
      });
      
      // There's a bug here. If you change to a different tab before this completes,
      // then the code below will throw an error message into the JavaScript console.
      // I think this is because it's trying to show a child view inside a view that no longer exists?
      // I haven't found any impact to the functioning of the app, so I've left it for now.
      
      // Now we show the view
      this.showChildView('setPickerRegion', setPicker);

      // rebind the UI elements, since we've added a new select field
      this.bindUIElements();
    })
  }, // end initialize
  
  // This function gets a randomised booster from the MtG API
  generateBooster(event) {
    
    // Prevent the default action, so we don't reload the page
    event.preventDefault();
    
    // We clear any previous results by showing an empty collection
      this.showChildView(
        'showBoosterRegion',
        new ResultListSimpleView({
        collection: new Backbone.Collection([])
      }));
    
    // We want to generate a random booster for the selected set
    // The JavaScript SDK for the MtG API hasn't implemented this functionality
    // As such, I need to call the API directly
    var setCode = this.ui.selectSetID[0].value;
    const self = this; // Saving this so I can use it inside the ajax call
    $.ajax({
      url:'https://api.magicthegathering.io/v1/sets/'+setCode+'/booster',
      success: function(data){

        // we get back a list of cards from the booster
        // we iterate the list and add each card to our model
        var cardsList = []; // this will hold the list of cards in our booster
        for(var i = 0; i < data.cards.length; i++) {

          // We're on the most recent printing, so we add the card to our list
          var newCard = {
            data: {
              name: data.cards[i].name,
              image: data.cards[i].imageUrl
            }
          }
          cardsList.push(newCard);
        }

        // We've finished adding all the cards to our list
        // Now we turn that list into a model and show the view with it
          self.showChildView(
            'showBoosterRegion',
            new ResultListSimpleView({
            collection: new Backbone.Collection(cardsList)
          }));
      },
      statusCode: {
        400: function() {
          // If we get a 400 status code, then the given set doesn't have boosters
          // We clear any previous results and instead display a message to the user
          self.showChildView(
            'showBoosterRegion',
            new BoosterEmptyView());
        }
      }
    });
    
  } // end searchCards()
  
});