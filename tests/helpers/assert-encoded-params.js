import Ember from 'ember';

export default Ember.Test.registerHelper('assertEncodedParams', function(app, paramName, searchObject) {
  let url = currentURL();
  let encoded =  btoa(JSON.stringify(searchObject));
  ok(url.indexOf(`${paramName}=${encoded}`) > -1);
});
