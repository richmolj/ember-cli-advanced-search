import Ember from 'ember';
import AdvancedSearchable from 'bb-advanced-search/mixins/advanced-searchable';

export default Ember.Controller.extend(AdvancedSearchable, {

  ajax: Ember.inject.service(),

  actions: {
    queryNameAutocomplete(query, deferred) {
      let promise = this.get('ajax').request('/autocompletes/name', {
        data: {
          filter: query.term,
          per_page: 5
        }
      });

      promise.then((response) => {
        deferred.resolve(response.results);
      });
    }
  }
});
