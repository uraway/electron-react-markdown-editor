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

export function addEntryCategory(text) {
  return { type: types.ADD_ENTRY_CATEGORY, text };
}

export function deleteEntryCategory(id) {
  return { type: types.DELETE_ENTRY_CATEGORY, id };
}

export function editEntryCategory(id, text) {
  return { type: types.EDIT_ENTRY_CATEGORY, id, text };
}

export function addHatenaEntry(id, title, summary, content, category, draftStatus) {
  return { type: types.ADD_HATENA_ENTRY, id, title, summary, content, category, draftStatus };
}

export function deleteHatenaEntry(id) {
  return { type: types.DELETE_HATENA_ENTRY, id };
}
