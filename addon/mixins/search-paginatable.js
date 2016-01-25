import Ember from 'ember';

export default Ember.Mixin.create({
  pagination:       Ember.computed.alias('metadata.pagination'),
  currentPage:      Ember.computed.alias('pagination.currentPage'),
  perPage:          Ember.computed.alias('pagination.perPage'),
  totalResultCount: Ember.computed.alias('pagination.total'),

  totalPages: Ember.computed('totalResultCount', 'perPage', function() {
    return Math.ceil(this.get('totalResultCount') / this.get('perPage'));
  })
});
