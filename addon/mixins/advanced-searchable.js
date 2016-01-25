import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['search'],
  search: null,

  actions: {
    query() {
      let model = this.get('model');
      this.set('search', model.get('queryParams'));
    },

    reset() {
      this.set('search', null);
    }
  }
});
