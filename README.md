![Build Status](https://api.travis-ci.org/richmolj/ember-cli-advanced-search.svg?branch=master)(https://travis-ci.org/richmolj/ember-cli-advanced-search)

# ember-cli-advanced-search

Simplify advanced search forms. Works well with
[trample](https://github.com/richmolj/trample) backend.

## Installation

`ember install ember-cli-advanced-search`

## Running

Define your route:

```es6
import Ember from 'ember';
import AdvancedSearchRouteable from 'ember-cli-advanced-search/mixins/advanced-search-routeable';

export default Ember.Route.extend(AdvancedSearchRouteable, {
  searchModel: 'people-search',
  aggregateOn: ['name'],

  model(params) {
    return this.query(params.search);
  }
});
```

...And controller

```es6
import Ember from 'ember';
import AdvancedSearchable from 'ember-cli-advanced-search/mixins/advanced-searchable';

export default Ember.Controller.extend(AdvancedSearchable)
```

...And model

```es6
import DS from 'ember-data';
import SearchBase from 'ember-cli-advanced-search/models/search-base';
import MF from 'model-fragments';

export default SearchBase.extend({
  conditions: MF.fragment('people-search/conditions', { defaultValue: {} }),
  results: DS.hasMany('person')
});
```

...And that model's conditions

```es6
import DS from 'ember-data';
import MF from 'model-fragments';

export default MF.Fragment.extend({
  name: DS.attr('string'),
  description: DS.attr('string')
});
```

Then bring everything together in a template:

```hbs
<form {{action 'query' on='submit'}}>
  {{input type='text' value=model.conditions.name }}
</form>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody>
    {{#each model.results as |result|}}
      <tr>
        <td>{{result.name}}</td>
        <td>{{result.description}}</td>
      </tr>
    {{/each}}
  </tbody>
</table>
```

### Faceting

Add `aggregateOn` to your route to specify the aggregations that should
come back:

```es6
// code
export default Ember.Route.extend(AdvancedSearchRouteable, {
  searchModel: 'people-search',
  aggregateOn: ['name']

  // code
});
```

Then add facet sections component to your template:

```hbs
{{facet-sections model.aggregations onFacetChange=(action 'query')}}
```

## Enhance findRecord in application adapter

We need to send query params via `findRecord`. Since ember data doesn't
support this out-of-the-box yet:

```es6
  // https://github.com/emberjs/data/issues/3596#issuecomment-126604014
  urlForFindRecord(id, modelName, snapshot) {
    let url   = this._super(id, modelName, snapshot);
    let query = Ember.get(snapshot, 'adapterOptions.params');
    if (query) {
      url += '?' + Ember.$.param(query);
    }
    return url;
  }
```

## Snake-cased server API

Because this addon uses [ember-data-model-fragments](https://github.com/lytics/ember-data-model-fragments), if the server is returning snake-cased attributes - like
search.metadata.current_page instead of search.metadata.currentPage -
you must register a custom serializer for ember-data-model-fragments if
you haven't already:

```es6
// https://github.com/lytics/ember-data-model-fragments/issues/166
// app/initializers/fragment-serializer

import DS from 'ember-data';

const FragmentSerializer = DS.JSONSerializer.extend({
  keyForAttribute(key) {
    return Ember.String.underscore(key);
  }
});

export default {
  name: 'FragmentSerializer',
  before: 'store',
  after: 'fragmentTransform',
  initialize: function(container) {
    container.register('serializer:-fragment', FragmentSerializer);
  }
};
```

## Autocompletes

Use the `autocomplete` service:

```es6
autocomplete: Ember.inject.service(),

actions: {
  queryPersonNameAutocomplete(query, deferred) {
    return this.get('autocomplete')
      .query('/api/autocomplete/people', query.term, deferred);
  }
}
```

This is now compatible with select2, e.g.

```hbs
{{select-2
  value=searchModel.conditions.people_ids.values
  allowClear=true
  multiple=true
  optionLabelPath='text'
  query="queryPersonNameAutocomplete"
}}
```
The expected server response is:

```
{
  data: [
    {
      id: 1,
      type: 'autocompletes',
      attributes: {
        key: 1,
        text: 'Joe'
      }
    }
  ]
}
```

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
