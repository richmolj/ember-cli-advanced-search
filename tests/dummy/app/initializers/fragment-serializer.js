import Ember from 'ember';
import DS from 'ember-data';

// https://github.com/lytics/ember-data-model-fragments/issues/166

const FragmentSerializer = DS.JSONSerializer.extend({
  keyForAttribute(key) {
    return Ember.String.underscore(key);
  }
});

export default {
  name: 'FragmentSerializer',
  before: 'store',
  after: 'fragmentTransform',
  initialize(container) {
    container.register('serializer:-fragment', FragmentSerializer);
  }
};
