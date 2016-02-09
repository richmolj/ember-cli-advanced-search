import Ember from 'ember';
import AdvancedSearchable from 'bb-advanced-search/mixins/advanced-searchable';
import queryAutocomplete from 'bb-advanced-search/utils/query-autocomplete';

export default Ember.Controller.extend(AdvancedSearchable, {

  ajax: Ember.inject.service(),

  actions: {
    queryNameAutocomplete(query, deferred) {
      queryAutocomplete(this.get('ajax'),
        '/autocompletes/name',
        query.term,
        deferred
      );
    }
  }
});
