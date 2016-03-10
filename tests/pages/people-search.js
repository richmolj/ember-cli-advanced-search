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
  visit:                    visitable('/'),
  visitMultipleModels:      visitable('/multiple-models'),
  nameValue:                value('#search_name'),
  name:                     fillable('#search_name'),
  description:              fillable('#search_description'),
  descriptionValue:         value('#search_description'),
  submit:                   clickable('#search_submit'),
  reset:                    clickable('#reset'),
  triggerBackgroundRefresh: clickable('#bg_refresh'),
  isLoading:                hasClass('loading', '.loading-area'),
  openNameAutocomplete:     clickable('#name_autocomplete .select2-input'),

  autocompleteOptions: collection({
    itemScope: '.select2-results li',

    item: {
      label: text('.select2-result-label')
    }
  }),

  nameAutocompleteSelections: collection({
    itemScope: '#name_autocomplete .select2-choices .select2-search-choice',

    item: {
      text: text('div')
    }
  }),

  perPage:       text('#per_page'),
  totalPages:    text('#total_pages'),
  totalResults:  text('#total_results'),
  currentPage:   text('#current_page'),
  pageTwo:       clickable('#page_two'),

  sortName:             clickable('th:nth-child(2) a'),
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
          click:     clickable('label'),
          label:     text('.bucket-label'),
          count:     text('.facet-count'),
          isChecked: isChecked('input[type="checkbox"]')
        }
      })
    }
  })
});
