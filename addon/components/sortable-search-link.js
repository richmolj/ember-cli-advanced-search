import Ember from 'ember';
import componentLayout from '../templates/components/sortable-search-link';

const SortableSearchLinkComponent = Ember.Component.extend({
  layout: componentLayout,
  tagName: '',

  defaultDirection: 'asc',
  model: Ember.computed.alias('parentView.model'),

  label: Ember.computed('sortAttribute', function() {
    return this.get('sortAttribute').capitalize();
  }),

  currentDirection: Ember.computed('model.metadata.sort.[]', function() {
    let sorts = this.get('model.metadata.sort');

    if (sorts.get('length') > 0) {
      let sort = sorts.find((s) => {
        return s.get('att') === this.get('sortAttribute');
      });

      if (sort) {
        return sort.get('dir');
      } else {
        return this.get('defaultDirection');
      }
    }
  }),

  flipSort() {
    let direction = this.get('currentDirection');
    return direction === 'asc' ? 'desc' : 'asc';
  },

  actions: {
    sort() {
      this.set('justClicked', true);
      let _this = this;
      let timeoutClicked = function() {
        _this.set('justClicked', false);
      };
      Ember.run.later(timeoutClicked, 100);
      this.get('onSort')(this.get('sortAttribute'), this.flipSort());
    }
  }
});

SortableSearchLinkComponent.reopenClass({
  positionalParams: ['sortAttribute']
});

export default SortableSearchLinkComponent;
