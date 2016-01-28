import Ember from 'ember';
import componentLayout from '../templates/components/sortable-search-links';

const SortableSearchLinksComponent = Ember.Component.extend({
  layout: componentLayout
});

SortableSearchLinksComponent.reopenClass({
  positionalParams: ['model', 'onSort']
});

export default SortableSearchLinksComponent;
