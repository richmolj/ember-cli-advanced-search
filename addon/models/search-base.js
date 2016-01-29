import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';
import SearchPaginatable from 'bb-advanced-search/mixins/search-paginatable';

export default DS.Model.extend(SearchPaginatable, {
  aggregations: MF.fragmentArray('search-base/aggregations', { defaultValue: [] }),
  metadata: MF.fragment('search-base/metadata', { defaultValue: { pagination: {} } }),

  toQueryParams() {
    let serialized = {
      conditions: this._serializeConditions(),
      aggregations: this.get('aggregations').serialize(),
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
  },

  fromQueryParams(encoded) {
    return new Ember.RSVP.Promise((resolve) => {
      if (encoded) {
        let decoded = JSON.parse(atob(encoded));

        this.set('metadata', decoded.metadata);
        this.set('aggregations', decoded.aggregations);

        for (let key in decoded.conditions) {
          this.set(`conditions.${key}`, decoded.conditions[key]);
        }
        resolve(this);
      }
    });
  },

  // Avoid forcing the app to create a serializer
  _serializeConditions() {
    let serializedConditions = this.get('conditions').serialize();
    for (let key in serializedConditions) {
      if (!serializedConditions[key]) {
        delete(serializedConditions[key]);
      }
    }
    return serializedConditions;
  }

});
