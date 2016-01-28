import MF from 'model-fragments';

export default MF.Fragment.extend({
  pagination: MF.fragment('search-base/metadata/pagination'),
  sort: MF.fragmentArray('search-base/metadata/sort')
});
