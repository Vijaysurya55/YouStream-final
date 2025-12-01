import { CATEGORY_SET } from "./categoryTypes.ts";

type State = {
  selectedId: string | null;
  selectedTitle: string | null;
};

const initialState: State = {
  selectedId: null,
  selectedTitle: null,
};

export default function categoryReducer(state = initialState, action: any) {
  switch (action.type) {
    case CATEGORY_SET:
      return {
        ...state,
        selectedId: action.payload.id ?? null,
        selectedTitle: action.payload.title ?? null,
      };

    default:
      return state;
  }
}