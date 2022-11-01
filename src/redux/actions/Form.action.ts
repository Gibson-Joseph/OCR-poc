import { TABLE_PAGE, PER_PAGE } from "../action-types/Pagination.types";

export const tablePage = (data: any) => ({
  payload: data,
  type: TABLE_PAGE,
});

export const perPage = (data: any) => ({
  payload: data,
  type: PER_PAGE,
})