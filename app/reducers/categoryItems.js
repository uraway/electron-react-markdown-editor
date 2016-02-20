import { ADD_CATEGORY_ITEM, DELETE_CATEGORY_ITEM, EDIT_CATEGORY_ITEM } from '../constants/ActionTypes';

const initialState = [
  {
    id: 0,
    text: 'ReactJS',
  },
];

export default function categoryItems(state = initialState, action) {
  switch (action.type) {
    case ADD_CATEGORY_ITEM:
      return [
        {
          id: Math.floor(Math.random() * 100000000),
          text: action.text,
        },
        ...state,
      ];

    case DELETE_CATEGORY_ITEM:
      return state.filter(item =>
        item.id !== action.id
      );

    case EDIT_CATEGORY_ITEM:
      return state.map(item =>
        item.id === action.id ?
          Object.assign({}, item, { text: action.text }) :
          item
      );

    default:
      return state;
  }
}
