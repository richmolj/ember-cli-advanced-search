// Not available in this test file...
String.prototype.startsWith = function(prefix) {
  return this.slice(0, prefix.length) == prefix;
}

export default function() {

  this.get('/people-searches/new', function(schema, request) {
    let totalResults = schema.person.all().length;
    let search = schema.create('peopleSearch', {
      id: new Date().getTime(),
      conditions: {name: 'Marge'},
      metadata: {pagination: {current_page: 1, total: totalResults, per_page: 3}}
    });

    return search;
  });

  this.patch('/people-searches/:id', function(schema, request) {
    let payload = JSON.parse(request.requestBody).data.attributes;
    console.log('PAYLOAD', payload);
    let conditions = payload.conditions;
    let metadata = payload.metadata;
    let search = schema.peopleSearch.find(request.params.id);

    if (!search) {
      search = schema.create('peopleSearch', {
        id: request.params.id,
        conditions: conditions,
        metadata: {pagination: {
          current_page: 1,
          total: 4,
          per_page: 3
        }}
      });
    }

    let results = schema.person.all();
    let totalResults = results.length;
    search.results = results;

    if (metadata) {
      let pagination = metadata.pagination;
      if (pagination.current_page) {
        search.metadata.pagination.current_page = pagination.current_page;
        search.metadata.pagination.per_page = pagination.per_page;
        search.metadata.pagination.total = totalResults;
      }

      let offset = ((metadata.pagination.current_page - 1) * metadata.pagination.per_page);
      search.results = search.results.toArray()
        .slice(offset, metadata.pagination.per_page + offset);

      let sorts = metadata.sort || [];
      search.metadata.sort = sorts;
    }

    search.results = search.results.filter((r) => {
      if (conditions.name) {
        return r.name.startsWith(conditions.name);
      } else {
        return true;
      }
    });

    return search;
  });
}
