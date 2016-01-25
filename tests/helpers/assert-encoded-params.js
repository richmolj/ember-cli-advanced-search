import Ember from 'ember';

export default Ember.Test.registerHelper('assertEncodedParams', function(app, paramName, searchObject) {
  let url = currentURL();
  let encoded =  btoa(JSON.stringify(searchObject));
  encoded = encoded.replace(/=/g, '%3D'); // url encoding

  // for debugging
  // let decoded = url.split(`${paramName}=`)[1].split('%3D')[0]
  // decoded = JSON.parse(window.atob(decoded));
  // console.log(decoded);

  ok(url.indexOf(`${paramName}=${encoded}`) > -1, `url should include encoded ${JSON.stringify(searchObject)}`);
});
