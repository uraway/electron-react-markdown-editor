import { ADD_ENTRY_CATEGORY, DELETE_ENTRY_CATEGORY, EDIT_ENTRY_CATEGORY } from '../constants/ActionTypes';

const initialState = [
  {
    id: 0,
    text: 'Electron',
  },
];

export default function entryCategory(state = initialState, action) {
  switch (action.type) {
    case ADD_ENTRY_CATEGORY:
      return [
        {
          id: Math.floor(Math.random() * 100000000),
          text: action.text,
        },
        ...state,
      ];

    case DELETE_ENTRY_CATEGORY:
      return state.filter(item =>
        item.id !== action.id
      );

    case EDIT_ENTRY_CATEGORY:
      return state.map(item =>
        item.id === action.id ?
          Object.assign({}, item, { text: action.text }) :
          item
      );

    default:
      return state;
  }
}
