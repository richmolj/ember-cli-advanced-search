import Ember from 'ember';

const Router = Ember.Router.extend({
  location: 'hash'
});

Router.map(function() {
  this.route('people-search', { path: '/' });
});

export default Router;
