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

  results: collection({
    itemScope: '.results .result',

    item: {
      name: text('.name')
    }
  })
});
