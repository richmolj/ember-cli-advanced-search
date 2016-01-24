import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['search'],
  search: null,

  //# params...
  actions: {
    query() {
      let model = this.get('model');
      this.set('search', model.get('queryParams'));
    }
  }

});
