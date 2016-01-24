import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | basic');

test('visiting /basic', function(assert) {
  visit('/basic');

  andThen(function() {
    assert.equal(currentURL(), '/basic');
  });
});
