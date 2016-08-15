import Ember from 'ember';

export default Ember.Mixin.create({
  searchModel: '', // ember data model name
  aggregateOn: [],

  reloadBlankSearch() {
    // for whatever reason peekRecord and reload: true not working
    let existing = this.store.peekAll(this.searchModel).content.findBy('id', 'new');
    if (existing) {
      this.store.unloadRecord(existing);
    }
    return this.fetchBlankSearch();
  },

  fetchBlankSearch() {
    let promise = this.store.findRecord(this.searchModel, 'new', {
      adapterOptions: {
        params: {
          aggregations: this.aggregateOn
        }
      },
      reload: true
    });
    promise.then((s) => {
      this._applyDefaults(s);
    });
    return promise;
  },

  reloadSearchFromQueryParams(searchParams) {
    let randomId = new Date().getTime();
    this.store.push({ data: { id: randomId, type: this.searchModel } });
    let search = this.store.peekRecord(this.searchModel, randomId);
    search = search.fromQueryParams(searchParams);
    return search;
  },

  freshSearch(searchParams) {
    let search = null;

    if (searchParams) {
      search = this.reloadSearchFromQueryParams(searchParams);
    } else {
      search = this.reloadBlankSearch();
    }

    return search;
  },

  // We want to resolve both the template and the query
  // before we have a final resolved model.
  query(searchParams, showLoading = true) {
    let search = this.freshSearch(searchParams);

    this._maybeSetController('isSearching', showLoading);
    return search.then((s) => {
      let promise = s.save();
      promise.then(() => {
        this._maybeSetController('isSearching', false);
      });
      return promise;
    });
  },

  // Override to provide client-side defaults
  queryDefaults() {
    return {};
  },

  resetModelViaQueryParams(searchParams) {
    let newModel = this.query(searchParams);
    newModel.then((search) => {
      let modelProperty = this.get('controller.searchModelProperty');
      this.set(`controller.${modelProperty}`, search);
    });
  },

  shouldReactToQueryParams(changed, totalPresent, removed) {
    return !!this.get('controller') && (changed.search || removed.search);
  },

  _applyDefaults(search) {
    let queryDefaults = this.queryDefaults();
    Object.keys(queryDefaults).forEach((key) => {
      search.set(key, queryDefaults[key]);
    });
  },

  _maybeSetController(key, value) {
    if (this.get('controller')) {
      this.set(`controller.${key}`, value);
    }
  },

  _debounceRefresh() {
    this.send('refresh', false);
  },

  _controllerSearchModel() {
    let modelProperty = this.get('controller.searchModelProperty');
    return this.get(`controller.${modelProperty}`);
  },

  _setResults(results) {
    let modelProperty = this.get('controller.searchModelProperty');
    return this.set(`controller.${modelProperty}.results`, results);
  },

  actions: {
    refresh(showLoading = true) {
      let promise = this.query(this._controllerSearchModel().toQueryParams(), showLoading);
      promise.then((search) => {
        this._setResults(search.get('results'));
      });
    },

    backgroundRefresh() {
      Ember.run.debounce(this, this._debounceRefresh, 1000);
    },

    queryParamsDidChange(changed, totalPresent, removed) {
      if (this.shouldReactToQueryParams(changed, totalPresent, removed)) {
        if (changed.search || removed.search) {
          this.resetModelViaQueryParams(totalPresent.search);
        }
      }
      this._super(changed, totalPresent, removed);
    }
  }
});
