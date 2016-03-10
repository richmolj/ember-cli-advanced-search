import Ember from 'ember';
import AdvancedSearchable from 'ember-cli-advanced-search/mixins/advanced-searchable';

export default Ember.Controller.extend(AdvancedSearchable, {
  searchModelProperty: 'model.search'
});
