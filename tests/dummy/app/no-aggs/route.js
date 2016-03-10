import Ember from 'ember';
import AdvancedSearchRouteable from 'ember-cli-advanced-search/mixins/advanced-search-routeable';

export default Ember.Route.extend(AdvancedSearchRouteable, {
  searchModel: 'people-search',

  model(params) {
    return this.query(params.search);
  },

  renderTemplate(_controller, _model) {
    this.render('people-search', {
      model: _model,
      controller: _controller
    });
  }

});
