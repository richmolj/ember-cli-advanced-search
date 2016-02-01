import PageObject from '../page-object';

let {
  visitable,
  fillable,
  value,
  text,
  collection,
  clickable,
  hasClass,
  customHelper
} = PageObject;

let isChecked = customHelper(function(selector) {
  return $(selector).prop('checked');
});

export default PageObject.create({
  visit:     visitable('/'),
  nameValue: value('#search_name'),
  name:      fillable('#search_name'),
  submit:    clickable('#search_submit'),
  reset:     clickable('#reset'),

  perPage:       text('#per_page'),
  totalPages:    text('#total_pages'),
  totalResults:  text('#total_results'),
  currentPage:   text('#current_page'),
  pageTwo:       clickable('#page_two'),

  sortName: clickable('th:nth-child(2) a'),
  nameHasSortAscClass:  hasClass('asc', 'th:nth-child(2) a'),
  nameHasSortDescClass: hasClass('desc', 'th:nth-child(2) a'),

  results: collection({
    itemScope: '.results .result',

    item: {
      name: text('.name')
    }
  }),

  facetSections: collection({
    itemScope: '.facets .facet',

    item: {
      header: text('.facet-header'),

      clickAll: clickable('.all-bucket'),

      buckets: collection({
        itemScope: '.buckets .bucket',

        item: {
          click:     clickable('input[type="checkbox"]'),
          label:     text('.bucket-label'),
          count:     text('.facet-count'),
          isChecked: isChecked('input[type="checkbox"]')
        }
      })
    }
  })
});
