import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | pagination', {
  beforeEach() {
    server.createList('person', 10, { name: 'Marge' });
  }
});

test('viewing basic pagination data', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(page.totalPages(), 4);
    assert.equal(page.perPage(), 3);
    assert.equal(page.currentPage(), 1);
    assert.equal(page.results().count(), 3);
  });
});

test('clicking a pagination link', function(assert) {
  page.visit().pageTwo();

  andThen(function() {
    assert.equal(page.totalPages(), 4, 'should have correct total pages');
    assert.equal(page.perPage(), 3, 'should have correct per_page');
    assert.equal(page.currentPage(), 2, 'should have correct current page');
    assert.equal(page.results().count(), 3, 'should return correct number of results');

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
          current_page: 2,
          per_page: 3
        },
        sort: []
      }
    });
  });
});
