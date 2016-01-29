import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import page from '../pages/people-search';

moduleForAcceptance('Acceptance | aggregations', {
  beforeEach() {
    server.createList('person', 7, { name: 'Marge' });
    server.createList('person', 2, { name: 'Bart' });
    server.perPage = 100;
    server.omitDefaultConditions = true;
  }
});

test('viewing basic aggregation data', function(assert) {
  page.visit();

  andThen(function() {
    assert.equal(page.facetSections().count(), 1, 'should have correct number of facet sections');
    assert.equal(page.totalResults(), 9, 'should have correct total results');
    assert.equal(page.results().count(), 9, 'should have correct table results');

    let nameSection = page.facetSections(1);
    assert.equal(nameSection.header(), 'Name', 'should have correct section label');
    assert.equal(nameSection.buckets().count(), 2, 'should have correct bucket count');
    assert.equal(nameSection.buckets(1).label(), 'Marge', 'should have correct first bucket label');
    assert.equal(nameSection.buckets(1).count(), 7, 'should have correct first bucket count');
    assert.equal(nameSection.buckets(1).isChecked(), false, 'should not have first bucket checked');

    assert.equal(nameSection.buckets(2).label(), 'Bart', 'should have correct second bucket lable');
    assert.equal(nameSection.buckets(2).count(), 2, 'should have correct second bucket count');
    assert.equal(nameSection.buckets(2).isChecked(), false, 'should not have second bucket checked');
  });
});

test('clicking a facet', function(assert) {
  page.visit().facetSections(1).buckets(1).click();

  andThen(function() {
    assert.equal(page.totalResults(), 7, 'should have correct total results');
    assert.equal(page.results().count(), 7, 'should have correct table results');
    assert.equal(page.facetSections(1).buckets().count(), 1, 'should have buckets reflect the resultset');
    assert.equal(page.facetSections(1).buckets(1).isChecked(), true, 'should check the selected bucket');

    assertEncodedParams('search', {
      conditions: {},
      aggregations: [
        {
          name: 'name',
          buckets: [
            {
              key: 'Marge',
              selected: true
            }
          ]
        }
      ],
      metadata: {
        pagination: {
          current_page: 1,
          per_page: server.perPage
        },
        sort: []
      }
    });
  });
});

test('clicking "all" when a facet is selected', function(assert) {
  page.visit().facetSections(1).buckets(1).click();

  andThen(function() {
    assert.equal(page.totalResults(), 7, 'should have correct total results');
    assert.equal(page.facetSections(1).buckets(1).isChecked(), true, 'should check the selected bucket');
    page.facetSections(1).clickAll();

    andThen(function() {
      assert.equal(page.totalResults(), 9, 'should reset total results');
      assert.equal(page.facetSections(1).buckets(1).isChecked(), false, 'should uncheck the selected bucket');
    });
  });
});
