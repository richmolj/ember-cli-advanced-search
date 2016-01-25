import Ember from 'ember';
import AdvancedSearchRouteable from 'bb-advanced-search/mixins/advanced-search-routeable';

export default Ember.Route.extend(AdvancedSearchRouteable, {

  model(params) {
    return this.query(params.search);
  }

});
