/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
  });

  // Use es6 in tests
  // https://github.com/babel/ember-cli-babel/issues/40
  app.import('bower_components/babel-polyfill/browser-polyfill.js', { prepend: true });
  app.import('bower_components/material-design-lite/material.css', { prepend: true });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
