import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({

  // https://github.com/emberjs/data/issues/3596#issuecomment-126604014
  urlForFindRecord(id, modelName, snapshot) {
    let url   = this._super(id, modelName, snapshot);
    let query = Ember.get(snapshot, 'adapterOptions.params');
    if (query) {
      url = `${url}?${Ember.$.param(query)}`;
    }
    return url;
  }

});
