// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import ResultListEmptyTemplate from '../../templates/cardTemplates/resultListEmpty.jst';

export default Mn.View.extend({
  template: ResultListEmptyTemplate,
});