// import dependencies
import Backbone from 'backbone';
import * as Mn from 'backbone.marionette';
import ResultSimpleTemplate from '../../templates/cardTemplates/resultSimple.jst';

export default Mn.View.extend({
  template: ResultSimpleTemplate,
  
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
});