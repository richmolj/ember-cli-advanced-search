import Ember from 'ember';
import componentLayout from '../templates/components/facet-section';

const FacetSectionComponent = Ember.Component.extend({
  layout: componentLayout,

  actions: {
    facetDidChange(facet, bucket) {
      bucket.toggleProperty('selected');
      this.get('onFacetChange')();
    },

    allBucketDidChange(facet) {
      facet.get('buckets').forEach((b) => {
        b.set('selected', false);
      });
      this.get('onFacetChange')();
    }
  }
});

FacetSectionComponent.reopenClass({
  positionalParams: ['facet']
});

export default FacetSectionComponent;
