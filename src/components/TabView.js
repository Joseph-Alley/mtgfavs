// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import tabsTemplate from '../templates/tabs.jst';
import $ from 'jquery';

// The three tabs
import SearchView from './SearchView';
import BoosterView from './BoosterView';
import FavouritesView from './FavouritesView';


export default Mn.View.extend({
  
  attributes: {class: 'tabs-wrap search-tab-active'}, // Add these classes to the view
  template: tabsTemplate, // Use this template for our view
  
  regions: {
    // this is where the tabs will appear, once their tab button is clicked
    childRegion: '#tabs-content'
  },
  
  events: {
    // We want to change the tab when the user clicks on one of the relevant buttons
    "click button": "changeTab"
  },
  
  ui: {
    // Binds the three buttons to the ui variables
    searchCardsBtn: "#search-card-btn",
    genBoosterBtn: "#generate-booster-btn",
    showFavsBtn: "#show-favs-btn"
  },
  
  initialize() {
    // We start by showing the first tab
    this.showChildView(
      'childRegion',
      new SearchView());
  }, // end initialize
  
  // This is called whenever one of the tab buttons is pressed.
  // It's responsible for switching to whichever tab is associated with the button.
  changeTab(event) {
    
    // Prevent the default action, so we don't reload the page
    event.preventDefault();    
    
    // We check which tab was clicked, and apply the appropriate view
    if(event.target.id === this.ui.searchCardsBtn[0].id) {
      // The Search Cards tab
      // Remove the 'active' classes for the other buttons
      this.$el.removeClass('gen-booster-active show-favs-active');
      
      // We add the active class for this tab
      this.$el.addClass('search-tab-active');
      
      // Now we change the view
      this.showChildView(
        'childRegion',
        new SearchView());
    }
    else if(event.target.id === this.ui.genBoosterBtn[0].id) {
      // The Generate Booster tab
      // Remove the 'active' classes for the other buttons
      this.$el.removeClass('search-tab-active show-favs-active');
      
      // We add the active class for this tab
      this.$el.addClass('gen-booster-active');
      
      // Now we change the view
      this.showChildView(
        'childRegion',
        new BoosterView());
    }
    else if(event.target.id === this.ui.showFavsBtn[0].id) {
      // The Show Favourites tab
      // Remove the 'active' classes for the other buttons
      this.$el.removeClass('search-tab-active gen-booster-active');
      
      // We add the active class for this tab
      this.$el.addClass('show-favs-active');
      
      // Now we change the view
      this.showChildView(
        'childRegion',
        new FavouritesView());
    }
    
    // If the button event doesn't match any of the tab buttons, then we don't do anything
  } // end changeTab()
});