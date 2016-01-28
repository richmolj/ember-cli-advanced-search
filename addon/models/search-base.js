import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';
import SearchPaginatable from 'bb-advanced-search/mixins/search-paginatable';

export default DS.Model.extend(SearchPaginatable, {
  metadata: MF.fragment('search-base/metadata', { defaultValue: { pagination: {} } }),

  queryParams: Ember.computed('conditions', 'metadata.pagination.currentPage', 'metadata.pagination.perPage', function() {
    let serialized = {
      conditions: this.get('conditions').serialize(),
      metadata: {
        pagination: {
          currentPage: this.get('metadata.pagination.currentPage'),
          perPage: this.get('metadata.pagination.perPage')
        },
        sort: this.get('metadata.sort').serialize()
      }
    };
    let encoded =  btoa(JSON.stringify(serialized));
    return encoded;
  }),

  fromQueryParams(encoded) {
    return new Ember.RSVP.Promise((resolve) => {
      if (encoded) {
        let decoded = JSON.parse(atob(encoded));

        this.set('metadata', decoded.metadata);

        for (let key in decoded.conditions) {
          this.set(`conditions.${key}`, decoded.conditions[key]);
        }
        resolve(this);
      }
    });
  }

});
