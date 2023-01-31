const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const SortType = {
  PRICE: 'price',
  DAY: 'day'
};

const FilterType = {
  ALL: 'ALL',
  FUTURE: 'FUTURE'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export { SortType, UpdateType, UserAction, FilterType, END_POINT };
