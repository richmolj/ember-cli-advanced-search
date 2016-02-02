import Ember from 'ember';
import componentLayout from '../templates/components/facet-sections';

const FacetSectionsComponent = Ember.Component.extend({
  layout: componentLayout,
  tagName: ''
});

FacetSectionsComponent.reopenClass({
  positionalParams: ['facets']
});

export default FacetSectionsComponent;
