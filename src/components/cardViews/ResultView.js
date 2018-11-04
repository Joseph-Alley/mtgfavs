// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import $ from 'jquery';
import ResultTemplate from '../../templates/cardTemplates/result.jst';

export default Mn.View.extend({
  template: ResultTemplate,
  
  onRender: function () {
    // Get rid of that pesky wrapping-div, to make nth-element selectors easier
    // Code from here: https://codepen.io/somethingkindawierd/pen/txnpE
    // Assumes 1 child element present in template.
    this.$el = this.$el.children();
    // Unwrap the element to prevent infinitely 
    // nesting elements during re-render.
    this.$el.unwrap();
    this.setElement(this.$el);
  },
  
  ui: {
    // Binds the form input to the ui variable
    // We can then grab it later without needing to use a DOM selector
    markFavouriteBtn: ".mark-favourite"
  },
  
  events: {
    // We want events for the favourite/un-favourite buttons
    "click button.mark-favourite": "markFavourite",
    "click button.remove-favourite": "removeFavourite"
  },
  
  // User has clicked the 'Mark as Favourite' button, so we want to send this card to the db
  markFavourite(event) {
    
    // Prevent the default action, so we don't reload the page
    event.preventDefault();
    
    // We submit the card name to the db, and get back the id of the db entry
    var self = this; // So we can use this within the block below
    $.post({
      url:'/favourites/submit',
      data: {cardName: this.model.attributes.data.name},
      success: function(data){
        
        // set the id of the favourite in our model, so we can remove it from the db if needed
        self.model.attributes.data.id = data.id; 
        self.render(); // We re-render our view now that we've changed the model
      }
    });
  },
  
  // The user has clicked the 'Remove Favourite' button, so we delete the favourite from the db
  removeFavourite(event) {
    
    // Prevent the default action, so we don't reload the page
    event.preventDefault();
    
    // We submit the favourite id to the db, so that it can identify and remove this card
    var self = this; // So we can use this within the block below
    $.ajax({
      url:'/favourites/'+this.model.attributes.data.id+'/delete',
      type: 'DELETE',
      data: {id: this.model.attributes.data.name},
      success: function(data){
        
        // set the id of the favourite as empty
        // the template will recognise this, and display the 'Mark as Favourite' button again
        self.model.attributes.data.id = ""; 
        self.render(); // We've changed the model, so we re-render the view
      }
    });
  },
});