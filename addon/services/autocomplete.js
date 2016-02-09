import Ember from 'ember';

export default Ember.Service.extend({

  ajax: Ember.inject.service(),

  query(endpoint, filterParam, deferred, options = {}) {
    let promise = this.get('ajax').request(endpoint, {
      data: {
        filter: filterParam,
        per_page: options.per_page || 5
      }
    });

    promise.catch(deferred.reject);
    promise.then((response) => {
      let { results } = response;

      if (options.callback) {
        results = results.map((item) => {
          return options.callback(item);
        });
      }

      deferred.resolve(results);
    });

    return promise;
  }

});
