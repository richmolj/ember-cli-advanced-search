import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';

export default DS.Model.extend({
  queryParams: Ember.computed('conditions', function() {
    let serialized = {conditions: this.get('conditions').serialize()};
    let encoded =  btoa(JSON.stringify(serialized));
    return encoded;
  }),

  fromQueryParams(encoded) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!encoded) { return }

      let decoded = JSON.parse(atob(encoded));

      for (var key in decoded.conditions) {
        this.set(`conditions.${key}`, decoded.conditions[key]);
      }
      resolve(this);
    });
  }

});
