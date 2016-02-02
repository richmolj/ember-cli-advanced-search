import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['search'],
  search: null,

  actions: {
    query(opts = { resetPagination: true }) {
      let model = this.get('model');

      if (opts.resetPagination) {
        model.set('currentPage', 1);
      }

      this.set('search', model.toQueryParams());
    },

    paginate(page) {
      this.set('model.currentPage', page);
      this.send('query', { resetPagination: false });
    },

    sort(attribute, direction) {
      let sort = { att: attribute, dir: direction };
      this.set('model.metadata.sort', [sort]);
      this.send('query');
    },

    reset() {
      if (this.get('search')) {
        this.set('search', null);
      } else {
        this.get('model').save();
      }
    }
  }
});
