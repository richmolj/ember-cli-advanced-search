import Ember from 'ember';

export default Ember.Mixin.create({

  reloadBlankSearch() {
    // for whatever reason peekRecord and reload: true not working
    let existing = this.store.peekAll('people-search').content.findBy('id', 'new');
    if (existing) {
      this.store.unloadRecord(existing);
    }
    return this.fetchBlankSearch();
  },

  fetchBlankSearch() {
    return this.store.findRecord('people-search', 'new', { reload: true });
  },

  reloadSearchFromQueryParams(searchParams) {
    let randomId = new Date().getTime();
    this.store.push({ data: { id: randomId, type: 'people-search' } });
    let search = this.store.peekRecord('people-search', randomId);
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

  query(searchParams) {
    let search = this.freshSearch(searchParams);
    search.then((s) => {
      s.save();
    });
    return search;
  },

  resetModelViaQueryParams(searchParams) {
    let newModel = this.query(searchParams);
    newModel.then((search) => {
      this.set('controller.model', search);
    });
  },

  shouldReactToQueryParams(changed, totalPresent, removed) {
    return !!this.get('controller') && (changed.search || removed.search);
  },

  actions: {
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
