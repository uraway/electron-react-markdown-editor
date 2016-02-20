import * as types from '../constants/ActionTypes';

export function addCategoryItem(text) {
  return { type: types.ADD_CATEGORY_ITEM, text };
}

export function deleteCategoryItem(id) {
  return { type: types.DELETE_CATEGORY_ITEM, id };
}

export function editCategoryItem(id, text) {
  return { type: types.EDIT_CATEGORY_ITEM, id, text };
}
