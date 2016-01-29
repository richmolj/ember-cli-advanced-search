import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | sorting', {
  beforeEach() {
    server.create('person', { name: 'Bart' });
    server.create('person', { name: 'Homer' });
  }
});

const assertSort = function(expectedSort) {
  assertEncodedParams('search', {
    conditions: {
      name: 'Marge'
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
      sort: expectedSort
    }
  });
};

// Mirage can't sort relationships: https://github.com/samselikoff/ember-cli-mirage/issues/533
// So we can't verify the table
test('toggling a sort header', function(assert) {
  page.visit().sortName();

  andThen(function() {
    assertSort([{ att: 'name', dir: 'asc' }]);
    assert.ok(page.nameHasSortAscClass(), 'has sort class "asc"');

    page.sortName();
    andThen(function() {
      assertSort([{ att: 'name', dir: 'desc' }]);
    });
  });
});
