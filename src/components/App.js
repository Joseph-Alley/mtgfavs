import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import TabView from './TabView';
import _ from 'underscore';

export default Marionette.Application.extend({
  region: '#app', // Our app resides inside this div

  onStart() {
      
    // We render all views using underscore's template handler
    Marionette.View.setRenderer(function(template, data) {
      return _.template(template)(data);
    });
    Marionette.CollectionView.setRenderer(function(template, data) {
      return _.template(template)(data);
    });
      
    // We show the Tab View, which will allow the user to switch between several views,
    // depending on what they need to do.
    this.showView(new TabView());
  }
});