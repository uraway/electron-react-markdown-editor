import { ADD_HATENA_ENTRY, DELETE_HATENA_ENTRY } from '../constants/ActionTypes';

const initialState = [
  {
    id: '',
    title: '',
    summary: '',
    content: '',
    category: [],
    draftStatus: false,
  },
];

export default function hatenaEntry(state = initialState, action) {
  switch (action.type) {
    case ADD_HATENA_ENTRY:
      return [
        {
          id: action.id,
          title: action.title,
          summary: action.summary,
          content: action.content,
          category: action.category,
          draftStatus: action.draftStatus,
        },
        ...state,
      ];

    case DELETE_HATENA_ENTRY:
      return state.filter(item =>
        item.id !== action.id
      );

    default:
      return state;
  }
}
