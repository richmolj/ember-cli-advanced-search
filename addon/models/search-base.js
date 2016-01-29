import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';
import SearchPaginatable from 'bb-advanced-search/mixins/search-paginatable';

export default DS.Model.extend(SearchPaginatable, {
  aggregations: MF.fragmentArray('search-base/aggregations', { defaultValue: [] }),
  metadata: MF.fragment('search-base/metadata', { defaultValue: { pagination: {} } }),

  toQueryParams() {
    let serialized = this.serialize().data.attributes;
    serialized.id = this.get('id');
    serialized.conditions = this._serializeConditions(serialized.conditions);
    console.log('serialized', serialized);
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
  _serializeConditions(conditions) {
    let serializedConditions = conditions;
    for (let key in serializedConditions) {
      if (!serializedConditions[key]) {
        delete(serializedConditions[key]);
      }
    }
    return serializedConditions;
  }

});
