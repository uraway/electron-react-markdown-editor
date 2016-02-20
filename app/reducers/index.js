import { combineReducers } from 'redux';
import categoryItems from './categoryItems';
import entryCategory from './entryCategory';

const rootReducer = combineReducers({
  categoryItems,
  entryCategory,
});

export default rootReducer;
