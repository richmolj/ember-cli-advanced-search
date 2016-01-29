import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONSerializer.extend({
  serialize(record, options) {
    let response = this._super(record, options);
    let selectedBuckets = Ember.A(response.buckets)
      .filterBy('selected')
      .map((b) => {
        return { key: b.key, selected: true };
      });

    return {
      name: response.name,
      buckets: selectedBuckets
    };
  }
});
