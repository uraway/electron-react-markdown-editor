import { combineReducers } from 'redux';
import categoryItems from './categoryItems';
import entryCategory from './entryCategory';
import hatenaEntry from './hatenaEntry';

const rootReducer = combineReducers({
  categoryItems,
  entryCategory,
  hatenaEntry,
});

export default rootReducer;
