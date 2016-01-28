import PageObject from '../page-object';

let {
  visitable,
  fillable,
  value,
  text,
  collection,
  clickable,
  hasClass
} = PageObject;

export default PageObject.create({
  visit:     visitable('/'),
  nameValue: value('#search_name'),
  name:      fillable('#search_name'),
  submit:    clickable('#search_submit'),
  reset:     clickable('#reset'),

  perPage: text('#per_page'),
  totalPages: text('#total_pages'),
  currentPage: text('#current_page'),
  pageTwo: clickable('#page_two'),

  sortName: clickable('th:nth-child(2) a'),
  nameHasSortAscClass: hasClass('asc', 'th:nth-child(2) a'),
  nameHasSortDescClass: hasClass('asc', 'th:nth-child(2) a'),

  results: collection({
    itemScope: '.results .result',

    item: {
      name: text('.name')
    }
  })
});
