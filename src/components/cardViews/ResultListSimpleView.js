// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import ResultListSimpleTemplate from '../../templates/cardTemplates/resultListSimple.jst';
import ResultSimpleView from './ResultSimpleView';

export default Mn.CollectionView.extend({
  childViewContainer: '.cards-list', // The views for single cards will be inserted here
  childView: ResultSimpleView, // This is the view we use for the individual cards
  attributes: {class: 'card-collection'},
  template: ResultListSimpleTemplate
});