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
    assert.equal(page.totalPages(), 4);
    assert.equal(page.perPage(), 3);
    assert.equal(page.currentPage(), 2);
    assert.equal(page.results().count(), 3);

    assertEncodedParams('search', {
      conditions: {
        name: 'Marge'
      },
      metadata: {
        pagination: {
          currentPage: 2,
          perPage: 3
        },
        sort: []
      }
    });
  });
});
