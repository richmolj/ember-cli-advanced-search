import PageObject from '../page-object';

let {
  visitable,
  fillable,
  value,
  text,
  collection,
  clickable
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

  results: collection({
    itemScope: '.results .result',

    item: {
      name: text('.name')
    }
  })
});
