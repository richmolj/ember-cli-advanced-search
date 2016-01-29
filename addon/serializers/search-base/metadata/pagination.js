import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  keyForAttribute(key) {
    return Ember.String.underscore(key);
  },

  serialize(snapshot, options) {
    let response = this._super(snapshot, options);

    return {
      current_page: response.current_page,
      per_page: response.per_page
    };
  }
});
