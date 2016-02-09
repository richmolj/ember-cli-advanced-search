import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';
import Ember from 'ember';

moduleForAcceptance('Acceptance | autocompletes', {
  beforeEach() {
    server.create('person', { name: 'Marge' });
    server.create('person', { name: 'Bart' });
    server.create('person', { name: 'Homer' });
    server.create('person', { name: 'Lisa' });
    server.omitDefaultConditions = true;
  }
});

const _selectAutocompleteOption = function(index) {
  Ember.$(`.select2-results li:nth-of-type(${index}) div`).trigger({ type: 'mouseup' });
};

test('querying via autocomplete', function(assert) {
  page.visit().openNameAutocomplete();

  andThen(function() {
    let autocompleteOptions = Ember.$('.select2-results li');
    assert.equal(autocompleteOptions.length, 4);

    _selectAutocompleteOption(2);

    andThen(function() {
      assert.equal(page.nameAutocompleteSelections().count(), 1);
      assert.equal(page.nameAutocompleteSelections(1).text(), 'Bart');

      page.openNameAutocomplete();

      andThen(function() {
        _selectAutocompleteOption(3);

        andThen(function() {
          assert.equal(page.nameAutocompleteSelections().count(), 2);
          assert.equal(page.nameAutocompleteSelections(2).text(), 'Homer');

          page.submit();

          andThen(function() {
            assert.equal(page.results().count(), 2);
            assert.equal(page.results(1).name(), 'Bart');
            assert.equal(page.results(2).name(), 'Homer');
          });
        });
      });
    });
  });
});
