import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | loading indicator', {
  beforeEach() {
    server.create('person', { name: 'Marge' });
    server.create('person', { name: 'Bart' });
    server.create('person', { name: 'Homer' });
    server.create('person', { name: 'Lisa' });
  }
});

test('it should show loading indicator when querying', function(assert) {
  page.visit();

  andThen(function() {
    assert.notOk(page.isLoading());
    server.timing = 100;
    page.name('Bart').submit();

    let done = assert.async();
    setTimeout(() => {
      assert.ok(page.isLoading());
      done();
    }, 80);

    andThen(function() {
      assert.notOk(page.isLoading());
      server.timing = 0;
    });
  });
});
