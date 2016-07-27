import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';
import SearchPaginatable from 'ember-cli-advanced-search/mixins/search-paginatable';

export default DS.Model.extend(SearchPaginatable, {
  aggregations: MF.fragmentArray('search-base/aggregations', { defaultValue: [] }),
  metadata: MF.fragment('search-base/metadata', { defaultValue: { pagination: {} } }),
  // TODO needs to be one base serializer so not sent to server as well
  serialized() {
    let serialized = this.serialize().data.attributes;
    serialized.id = this.get('id');
    serialized.conditions = this._serializeConditions(serialized.conditions);
    return serialized;
  },

  // TODO needs to be one base serializer so not sent to server as well
  toQueryParams() {
    let encoded =  btoa(JSON.stringify(this.serialized()));
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

  // N.B. - have to create a new ID versus use the existing one.
  // Otherwise if you add a condition, then remove it (back button)
  // the condition will not be removed (likely ember data bug)
  _pushRecord(payload) {
    let newId = new Date().getTime();
    this.store.pushPayload({ data: {
      type: this.constructor.modelName,
      id: newId,
      attributes: payload
    } });
    let pushed = this.store.peekRecord(this.constructor.modelName, newId);

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
