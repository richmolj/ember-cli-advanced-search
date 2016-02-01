import Ember from 'ember';

export default Ember.Mixin.create({
  pagination:       Ember.computed.alias('metadata.pagination'),
  currentPage:      Ember.computed.alias('pagination.currentPage'),
  perPage:          Ember.computed.alias('pagination.perPage'),
  totalResultCount: Ember.computed.alias('pagination.total'),

  // Specifically for ember-cli-pagination compatibility
  // https://github.com/mharris717/ember-cli-pagination/issues/153
  paginationContent: Ember.computed(function() {
    return {
      page: this.get('currentPage'),
      totalPages: this.get('totalPages')
    };
  }),

  totalPages: Ember.computed('totalResultCount', 'perPage', function() {
    return Math.ceil(this.get('totalResultCount') / this.get('perPage'));
  })
});
