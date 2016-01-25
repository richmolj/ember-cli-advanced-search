import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | location history');

test('initialize with defaults from the )erver', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(currentURL(), '/');

    assert.equal(page.nameValue(), 'Marge');
    assert.equal(page.results().count(), 1);
    assert.equal(page.results(1).name(), 'Marge');
  });
});

test('basic text query', function(assert) {
  page.visit().name('Bart').submit();

  andThen(function() {
    assertEncodedParams('search', { conditions: { name: 'Bart' } });
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

test('loading from a url with an encoded search param', function(assert) {
  let searchObj = { conditions: { name: 'Bart' } };
  let encoded = btoa(JSON.stringify(searchObj));
  page.visit({}, { search: encoded });

  andThen(function() {
    assert.equal(page.nameValue(), 'Bart');
    assert.equal(page.results().count(), 1);
    assert.equal(page.results(1).name(), 'Bart');
  });
});

test('resetting a search that has been loaded from URL state', function(assert) {
  let searchObj = { conditions: { name: 'Bart' } };
  let encoded = btoa(JSON.stringify(searchObj));
  page.visit({}, { search: encoded });

  andThen(function() {
    page.reset();

    andThen(function() {
      assert.equal(currentURL(), '/');
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
