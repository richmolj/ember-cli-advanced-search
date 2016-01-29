import Ember from 'ember';

// silence deprecations
Ember.deprecate = function() { };
Ember.warn = function() { };
Ember.Logger.warn = function() { };

import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

App.LOG_TRANSITIONS = true;

loadInitializers(App, config.modulePrefix);

export default App;
