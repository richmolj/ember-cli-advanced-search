import Ember from 'ember';

export default Ember.Test.registerHelper('assertEncodedParams', function(app, paramName, searchObject) {
  let url = currentURL();

  let decoded = url.split(`${paramName}=`)[1].split('%3D');
  decoded = JSON.parse(window.atob(decoded[0]));

  deepEqual(decoded.conditions, searchObject.conditions, 'should have correct conditions encoded in URL');
  deepEqual(decoded.aggregations, searchObject.aggregations, 'should have correct aggregations encoded in URL');
  deepEqual(decoded.metadata.pagination, searchObject.metadata.pagination, 'should have correct pagination encoded in URL');
  deepEqual(decoded.metadata.sort, searchObject.metadata.sort, 'should have correct sort encoded in URL');
});
