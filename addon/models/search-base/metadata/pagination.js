import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  currentPage: DS.attr('number'),
  perPage: DS.attr('number'),
  total: DS.attr('number')
});
