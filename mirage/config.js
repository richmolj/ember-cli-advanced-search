// Not available in this test file...
String.prototype.startsWith = function(prefix) {
  return this.slice(0, prefix.length) == prefix;
}

const filterBy = function(arr, attr, value) {
  let filtered = [];
  for (let obj of arr) {
    if (obj[attr] === value) {
      filtered.push(obj);
    }
  }
  return filtered;
}

const findBy = function(arr, attr, value) {
  return filterBy(arr, attr, value)[0];
}

const bucketBy = function(arr, attr) {
  let counts = [];
  for (let obj of arr) {
    if (Ember.A(counts).any((c) => { return c.key == obj[attr] })) {
      let count = findBy(counts, 'key', obj[attr]);
      count.count++
    } else {
      counts.push({ key: obj[attr], count: 1, selected: false });
    }
  }
  return counts;
}

const applyPagination = function(payload, search) {
  let pagination = payload.metadata.pagination;
  let totalResults = search.results.length;

  search.metadata.pagination.current_page = pagination.current_page;
  search.metadata.pagination.per_page = pagination.per_page;
  search.metadata.pagination.total = totalResults;

  let offset = ((payload.metadata.pagination.current_page - 1) * payload.metadata.pagination.per_page);
  search.results = search.results.toArray()
    .slice(offset, payload.metadata.pagination.per_page + offset);
}

const applySorts = function(payload, search) {
  let sorts = payload.metadata.sort || [];
  search.metadata.sort = sorts;
}

const applyAggs = function(payload, search) {
  let people = search.results.toArray();
  let allAggregations = [
    {
      name: 'name',
      label: 'Name',
      order: 1,
      buckets: bucketBy(people, 'name')
    }
  ]

  allAggregations = allAggregations.filter((a) => {
    let requestedAggNames = Ember.A(payload.aggregations).mapBy('name');
    return Ember.A(requestedAggNames).contains(a.name);
  });

  search.aggregations = allAggregations;
  if (payload.aggregations.length > 0) {
    let newFilteredAggs = []
    for (let agg of payload.aggregations) {
      let fatAgg = filterBy(allAggregations, 'name', agg.name)[0];
      for (let bucket of agg.buckets) {
        let fatBucket = filterBy(fatAgg.buckets, 'key', bucket.key)[0];
        fatBucket.selected = true;
      }
      newFilteredAggs.push(fatAgg);
    }
    search.aggregations = newFilteredAggs;
  }
}

const filterResultsViaConditions = function(payload, search) {
  search.results = search.results.filter((r) => {
    if (payload.conditions.name) {
      return r.name.startsWith(payload.conditions.name);
    } else {
      return true;
    }
  });
}

const filterResultsViaAggs = function(payload, search) {
  let selectedBucketKeys = [].concat
    .apply([], Ember.A(payload.aggregations).map((f) => Ember.A(f.buckets).mapBy('key')));
  if (selectedBucketKeys.length > 0) {
    search.results = search.results.filter((r) => {
      return Ember.A(selectedBucketKeys).contains(r.name);
    });
  }
}

const _searchAttrs = function(payload) {
  return {
    conditions: payload.conditions,
    aggregations: [],
    metadata: {
      pagination: {
        current_page: 1,
        total: 4,
        per_page: perPage()
      },
      sort: []
    }
  }
}

const initSearch = function(schema, id, payload) {
  let search = schema.peopleSearch.find(id);

  if (!search) {
    let attrs = _searchAttrs(payload);
    attrs.id = id;
    search = schema.create('peopleSearch', attrs);
  }

  return search;
}

let perPage = function() {
  return getServer().perPage || 3;
}

// Running through web (not test) there is no server
let getServer = function() {
  try {
    return server;
  } catch(e) {
    return {};
  }
}

export default function() {

  this.get('/people-searches/new', function(schema, request) {
    let totalResults = schema.person.all().length;

    let conditions = {};
    if (!getServer().omitDefaultConditions) {
      conditions = { name: 'Marge' }
    }

    let requestedAggs = [];
    if (request.queryParams.aggregations) {
      requestedAggs = request.queryParams.aggregations.map((name) => {
        return { name: name, buckets: [] };
      });
    }

    let search = schema.create('peopleSearch', {
      id: new Date().getTime(),
      conditions: conditions,
      aggregations: requestedAggs,
      metadata: {pagination: {current_page: 1, total: totalResults, per_page: perPage()}}
    });

    return search;
  });

  this.patch('/people-searches/:id', function(schema, request) {
    if (getServer().queries) {
      getServer().queries = getServer().queries + 1;
    } else {
      getServer().queries = 1;
    }

    let payload = JSON.parse(request.requestBody).data.attributes;
    console.log('QUERY PAYLOAD:', payload);

    let search = initSearch(schema, request.params.id, payload)
    let results = schema.person.all();
    search.results = results;

    filterResultsViaConditions(payload, search);
    filterResultsViaAggs(payload, search);
    if (payload.metadata) {
      applyAggs(payload, search);
      applyPagination(payload, search);
      applySorts(payload, search);
    }
    search.save();

    return search;
  });
}
