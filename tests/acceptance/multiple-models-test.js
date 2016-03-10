import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | multiple models', {
  beforeEach() {
    server.create('person', { name: 'Marge' });
    server.create('person', { name: 'Bart' });
    server.create('person', { name: 'Homer' });
    server.create('person', { name: 'Lisa' });
  }
});

test('it should work with a route returning a hash', function(assert) {
  page.visitMultipleModels();

  andThen(function() {
    page.name('Bart').submit();

    andThen(function() {
      assert.equal(page.results().count(), 1, 'should have correct result count');
      assert.equal(page.results(1).name(), 'Bart', 'should have correct results');
    });
  });
});
