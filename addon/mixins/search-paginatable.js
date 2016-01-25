import Ember from 'ember';

export default Ember.Mixin.create({
  pagination:       Ember.computed.alias('metadata.pagination'),
  currentPage:      Ember.computed.alias('pagination.current_page'),
  perPage:          Ember.computed.alias('pagination.current_page'),
  totalResultCount: Ember.computed.alias('pagination.total'),

  totalPages: Ember.computed('totalResultCount', function() {
    return Math.ceil(this.get('totalResultCount') / this.get('perPage'));
  })
});
