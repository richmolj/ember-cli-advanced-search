import Ember from 'ember';
import layout from '../templates/components/facet-sections';

const FacetSectionsComponent = Ember.Component.extend({
  layout: layout,
  tagName: '',
});

FacetSectionsComponent.reopenClass({
  positionalParams: ['facets']
});

export default FacetSectionsComponent;
