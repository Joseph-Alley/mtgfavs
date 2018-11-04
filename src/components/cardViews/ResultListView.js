// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import ResultListTemplate from '../../templates/cardTemplates/resultList.jst';
import ResultView from './ResultView';

export default Mn.CollectionView.extend({
  childViewContainer: '.cards-list', // The views for single cards will be inserted here
  childView: ResultView, // This is the view we use for the individual cards
  attributes: {class: 'card-collection'},
  template: ResultListTemplate
});