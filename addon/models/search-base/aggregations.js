import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  name:    DS.attr('string'),
  label:   DS.attr('string'),
  order:   DS.attr('number'),
  buckets: MF.fragmentArray('search-base/aggregations/bucket'),

  allBucketLabel: Ember.computed('name', function() {
    return `${this.get('name')}-all-bucket`;
  }),

  hasSelection: Ember.computed('buckets.@each.selected', function() {
    return this.get('buckets').filterBy('selected').get('length') > 0;
  }),

  noSelection: Ember.computed('hasSelection', function() {
    return !this.get('hasSelection');
  })
});
