import Ember from 'ember';

export default Ember.Service.extend({

  ajax: Ember.inject.service(),

  query(endpoint, filterParam, deferred, options = {}) {
    let promise = this.get('ajax').request(endpoint, {
      data: {
        filter: filterParam,
        per_page: options.per_page || 5,
        user_query: options.user_query
      }
    });

    promise.catch(deferred.reject);
    promise.then((response) => {
      let results = response.data.map(this._grabAttributes);
      results = this._postProcess(results, options.callback);
      deferred.resolve(results);
    });

    return promise;
  },

  _grabAttributes(item) {
    let { attributes } = item;
    attributes.id = item.id;
    return attributes;
  },

  _postProcess(results, postProcessor) {
    if (postProcessor) {
      return results.map((item) => {
        return postProcessor(item);
      });
    } else {
      return results;
    }
  }
});
