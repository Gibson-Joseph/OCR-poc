import { TABLE_PAGE } from "../action-types/Pagination.types";

export const tablePage = (data: any) => ({
  payload: data,
  type: TABLE_PAGE,
});
