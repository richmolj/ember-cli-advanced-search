// Not available in this test file...
String.prototype.startsWith = function(prefix) {
  return this.slice(0, prefix.length) == prefix;
}

export default function() {

  this.get('/people-searches/new', function(schema, request) {
    let search = schema.create('peopleSearch', {
      id: new Date().getTime(),
      conditions: {name: 'Marge'}
    });
    return search;
  });

  this.patch('/people-searches/:id', function(schema, request) {
    let conditions = JSON.parse(request.requestBody).data.attributes.conditions;
    console.log('conditions sent', request.requestBody);
    console.log('conditions', conditions);

    let search = schema.peopleSearch.find(request.params.id);
    if (!search) {
      search = schema.create('peopleSearch', {id: request.params.id, conditions: conditions});
    }

    search.createPerson({name: 'Marge'});
    search.createPerson({name: 'Homer'});
    search.createPerson({name: 'Bart'});
    search.createPerson({name: 'Lisa'});

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
