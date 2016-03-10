import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['search'],
  search: null,
  searchModelProperty: 'model',

  actions: {
    query(opts = { resetPagination: true }) {
      let model = this.get(this.get('searchModelProperty'));

      if (opts.resetPagination) {
        model.set('currentPage', 1);
      }

      this.set('search', model.toQueryParams());
    },

    paginate(page) {
      this.set(`${this.get('searchModelProperty')}.currentPage`, page);
      this.send('query', { resetPagination: false });
    },

    sort(attribute, direction) {
      let sort = { att: attribute, dir: direction };
      this.set(`${this.get('searchModelProperty')}.metadata.sort`, [sort]);
      this.send('query');
    },

    reset() {
      if (this.get('search')) {
        this.set('search', null);
      } else {
        this.send('refresh');
      }
    }
  }
});
