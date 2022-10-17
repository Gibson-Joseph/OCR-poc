import { combineReducers } from "redux";
import paginationReducer from "./Pagination.reducer";

const rootReducer = combineReducers({
  pagination: paginationReducer,
});
export default rootReducer;
