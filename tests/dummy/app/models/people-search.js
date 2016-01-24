import DS from 'ember-data';
import SearchBase from './search-base'
import MF from 'model-fragments';

export default SearchBase.extend({
  conditions: MF.fragment('people-search/conditions', {defaultValue: {}}),
  results: DS.hasMany('person')
});
