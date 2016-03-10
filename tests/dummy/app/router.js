import Ember from 'ember';

const Router = Ember.Router.extend({
  location: 'hash'
});

Router.map(function() {
  this.route('people-search', { path: '/' });
  this.route('people-search-client-side-defaults');
  this.route('people-search-no-aggs');
  this.route('multiple-models');
});

export default Router;
