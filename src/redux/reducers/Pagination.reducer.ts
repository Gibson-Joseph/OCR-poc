import { TABLE_PAGE } from "../action-types/Pagination.types";
import { StateType } from "../models/State.type";

const INITIAL_STATE: StateType = {
  activePage: 1,
};

function formReducer(state = INITIAL_STATE, action: any): any {
  let myPayload = { ...action.payload };

  switch (action.type) {
    case TABLE_PAGE: {
      return {
        ...state,
        activePage: action.payload,
      };
    }

    default:
      return state;
  }
}
export default formReducer;
