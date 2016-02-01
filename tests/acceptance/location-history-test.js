import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | location history', {
  beforeEach() {
    server.create('person', { name: 'Marge' });
    server.create('person', { name: 'Bart' });
    server.create('person', { name: 'Homer' });
    server.create('person', { name: 'Lisa' });
  }
});

const searchObj = function() {
  return {
    id: new Date().getTime(),
    conditions: { name: 'Bart' },
    aggregations: [],
    metadata: { pagination: { current_page: 1, per_page: 3 } }
  };
};

test('initialize with defaults from the server', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(currentURL(), '/');

    assert.equal(page.nameValue(), 'Marge', 'message');
    assert.equal(page.results().count(), 1);
    assert.equal(page.results(1).name(), 'Marge');
  });
});

test('basic text query', function(assert) {
  page.visit().name('Bart').submit();

  andThen(function() {
    assertEncodedParams('search', {
      conditions: {
        name: 'Bart'
      },
      aggregations: [
        {
          name: 'name',
          buckets: []
        }
      ],
      metadata: {
        pagination: {
          current_page: 1,
          per_page: 3
        },
        sort: []
      }
    });
    assert.equal(page.nameValue(), 'Bart');
    assert.equal(page.results().count(), 1);
    assert.equal(page.results(1).name(), 'Bart');

    window.history.back();
    let done = assert.async();
    let checkBack = function() {
      assert.equal(currentURL(), '/');
      assert.equal(page.nameValue(), 'Marge');
      assert.equal(page.results().count(), 1);
      assert.equal(page.results(1).name(), 'Marge');
      done();
    };
    setTimeout(checkBack, 50);
  });
});

test('loading indicator', function(assert) {
  page.visit();

  andThen(function() {
    assert.notOk(page.isLoading());
    page.name('Bart').submit();

    let done = assert.async();
    setTimeout(() => {
      assert.ok(page.isLoading());
      done();
    }, 50);

    andThen(function() {
      assert.notOk(page.isLoading());
    });
  });

});

// Ensures pushPayload resets record
test('removing a condition via back button', function(assert) {
  page.visit().name('Bart').submit();

  andThen(function() {
    page.description('Son').submit();

    andThen(function() {
      assert.equal(page.descriptionValue(), 'Son');
      window.history.back();

      let done = assert.async();
      let checkBack = function() {
        assert.equal(page.descriptionValue(), '');
        done();
      };
      setTimeout(checkBack, 50);
    });
  });
});

test('loading from a url with an encoded search param', function(assert) {
  let encoded = btoa(JSON.stringify(searchObj()));
  page.visit({}, { search: encoded });

  andThen(function() {
    assert.equal(page.nameValue(), 'Bart');
    assert.equal(page.results().count(), 1);
    assert.equal(page.results(1).name(), 'Bart');
  });
});

test('resetting a search that has been loaded from URL state', function(assert) {
  let encoded = btoa(JSON.stringify(searchObj()));
  page.visit({}, { search: encoded });

  andThen(function() {
    page.reset();

    andThen(function() {
      assert.equal(currentURL(), '/');
    });
  });
});

test('resetting a search that is not dirty', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(server.queries, 1);
    page.reset();

    andThen(function() {
      assert.equal(server.queries, 2, 'should still query the server');
    });
  });
});

test('resetting a search that has been modified by the user', function(assert) {
  page.visit().name('Bart').submit();

  andThen(function() {
    page.reset();
    assert.equal(page.results(1).name(), 'Bart');

    andThen(function() {
      assert.equal(currentURL(), '/');
      assert.equal(page.nameValue(), 'Marge');
      assert.equal(page.results().count(), 1);
      assert.equal(page.results(1).name(), 'Marge');
    });
  });
});
