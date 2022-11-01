import { TABLE_PAGE, PER_PAGE } from "../action-types/Pagination.types";
import { StateType } from "../models/State.type";

const INITIAL_STATE: StateType = {
  activePage: 1,
  perPage: 10,
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
    case PER_PAGE: {
      return {
        ...state,
        perPage: action.payload
      }
    }

    default:
      return state;
  }
}
export default formReducer;
