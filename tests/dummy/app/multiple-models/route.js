import Ember from 'ember';
import AdvancedSearchRouteable from 'ember-cli-advanced-search/mixins/advanced-search-routeable';

export default Ember.Route.extend(AdvancedSearchRouteable, {
  searchModel: 'people-search',

  model(params) {
    return Ember.RSVP.hash({
      search: this.query(params.search),
      somethingElse: { foo: 'bar' }
    });
  }

});
