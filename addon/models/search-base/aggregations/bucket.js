import Ember from 'ember';
import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  key: DS.attr('string'),
  label: DS.attr('string'),
  value: DS.attr('string'),
  count: DS.attr('number'),
  selected: DS.attr('boolean'),

  friendlyCount: Ember.computed('count', function() {
    return this.get('count')
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  })
});
