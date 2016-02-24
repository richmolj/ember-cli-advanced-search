import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | background refresh', {
  beforeEach() {
    server.create('person');
    server.omitDefaultConditions = true;
  }
});

test('triggering background refresh', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(page.results().count(), 1, 'show have correct initial results');
    server.create('person');
    server.timing = 100;
    page.triggerBackgroundRefresh();

   let done = assert.async();
    setTimeout(() => {
      assert.notOk(page.isLoading(), 'should not show loading indicator');
      done();
    }, 80);

    andThen(function() {
      assert.equal(page.results().count(), 2, 'show update the search results');
      server.timing = 0;
    });
  });
});
