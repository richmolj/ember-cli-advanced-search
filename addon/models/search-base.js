import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';
import SearchPaginatable from 'bb-advanced-search/mixins/search-paginatable';

export default DS.Model.extend(SearchPaginatable, {
  aggregations: MF.fragmentArray('search-base/aggregations', { defaultValue: [] }),
  metadata: MF.fragment('search-base/metadata', { defaultValue: { pagination: {} } }),

  toQueryParams() {
    let serialized = {
      id: this.get('id'),
      conditions: this._serializeConditions(),
      aggregations: this.get('aggregations').serialize(),
      metadata: {
        pagination: this.get('metadata.pagination').serialize(),
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
        resolve(this._pushRecord(decoded));
      }
    });
  },

  _pushRecord(payload) {
    this.store.pushPayload({ data: {
      type: this.constructor.modelName,
      id: payload.id,
      attributes: payload
    } });
    let pushed = this.store.peekRecord(this.constructor.modelName, payload.id);
    return pushed;
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
