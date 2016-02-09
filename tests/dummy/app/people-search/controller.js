import Ember from 'ember';
import AdvancedSearchable from 'bb-advanced-search/mixins/advanced-searchable';

export default Ember.Controller.extend(AdvancedSearchable, {

  autocomplete: Ember.inject.service(),

  actions: {
    queryNameAutocomplete(query, deferred) {
      this.get('autocomplete').query('/autocompletes/name',
        query.term,
        deferred
      );
    }
  }
});
