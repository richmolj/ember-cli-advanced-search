import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | client-side defaults', {
  beforeEach() {
    server.create('person', { name: 'Marge' });
    server.create('person', { name: 'Bart' });
    server.create('person', { name: 'Homer' });
    server.create('person', { name: 'Lisa' });
  }
});

test('initialize with defaults from the server', function(assert) {
  visit('/people-search-client-side-defaults');

  andThen(function() {
    assert.equal(page.results().count(), 1, 'should have correct result count based on client-side defaults');
    assert.equal(page.results(1).name(), 'Lisa', 'should have correct result content based on client-side defaults');
  });
});

test('resetting a search without losing client-side defaults', function(assert) {
  visit('/people-search-client-side-defaults');

  andThen(function() {
    page.name('Bart').submit();

    andThen(function() {
      assert.equal(page.results(1).name(), 'Bart', 'should have correct setup');
      page.reset();

      andThen(function() {
        assert.equal(page.results(1).name(), 'Lisa', 'should have correct result content based on client-side defaults');
      });
    });
  });
});
