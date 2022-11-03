import React, { useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

// Icon
import { BiArrowToLeft } from "react-icons/bi";
import { BiArrowToRight } from "react-icons/bi";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";

//Ag-Grid-Style
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import Api from "../helpers/interceptor/interceptor";
import { tablePage, perPage } from "../redux/actions/Form.action";
import toastMsg from "../service/toastMsg/toast";

const Table = () => {
  const columnDef = [
    { field: "name" },
    { field: "door_no" },
    { field: "address" },
    { field: "city" },
    { field: "pincode" },
    { field: "taluk" },
    { field: "district" },
    { field: "mobile" },
    { field: "landline" },
    { field: "email" },
  ];

  const dispatch = useDispatch();
  const activePageState = useSelector(
    (state: any) => state.pagination.activePage
  );
  const perPageState = useSelector((state: any) => state.pagination.perPage)

  console.log("activePageState", activePageState);
  console.log("perPageState", perPageState);

  const [rowData, setRowData] = useState<any>();
  const [page, setPage] = useState<any>();
  const [loading, setLoading] = useState(false)

  const gridRef = useRef<AgGridReact>(null);

  const fetchData = async () => {
    await Api(
      `/v1/customers_list?page=${activePageState}&per_page=${perPageState}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        setRowData(res.data.customers);
        setPage(res.data.pagination);
        setLoading(false)
      })
      .catch((err) => {
        toastMsg("error", ", could not fetch data")
        console.log(err)
      });
  };

  const clickIncCountPage = () => {
    dispatch(tablePage(page?.next_page));
  };

  const clickDecCountPage = () => {
    dispatch(tablePage(page?.prev_page));
  };

  const clickLastPage = () => {
    dispatch(tablePage(page?.total_pages));
  };

  const clickFirstPage = () => {
    dispatch(tablePage(1));
  };

  const navigate = useNavigate();

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
    }),
    []
  );

  const clickNav = () => {
    navigate("/scanner", { state: true });
    window.location.reload()
  };

  useEffect(() => {
    fetchData();
  }, [activePageState, perPageState]);

  return (
    <div className="w-full h-full ag-theme-alpine">
      {/* Toast Component */}

      {/* Ag-Grid-COmponent */}
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDef}
        rowData={rowData}
        defaultColDef={defaultColDef}
        animateRows={true}
        overlayLoadingTemplate={"<span>Please wait while your rows are loading...</span>"}
        overlayNoRowsTemplate={'<span>No data found to display.</span>'}
      />

      {/* pagination */}
      <div className="h-24 sm:h-12 w-full border-2 px-6">
        <div className="flex flex-wrap sm:flex-nowrap sm:flex-row justify-center sm:justify-end items-center h-full">
          <div>
            <span className="mr-2">PerPage</span>
            <select
              className="w-20 py-2"
              name=""
              onChange={(e) => dispatch(perPage(e.target.value))}
              value={perPageState}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          <div className="sm:mx-12 my-2">
            <b>{page?.start_at ? page?.start_at : "1"}</b>
            <span className="px-1">to</span>
            <b>{page?.end_at}</b>
            <span className="px-1">of</span>
            <b>{page?.total_count ? page?.total_count : "1"}</b>
          </div>

          <div className="flex">
            <span>
              <button onClick={() => clickFirstPage()} className="mr-3">
                <BiArrowToLeft />
              </button>
            </span>
            <span>
              <button
                onClick={() => clickDecCountPage()}
                disabled={page?.prev_page === null ? true : false}
                className="float-right"
              >
                <MdOutlineArrowBackIos />
              </button>
            </span>
            <span className="mx-3">
              <span className="p-1">Page</span>
              <b>{page?.current_page ? page?.current_page : "1"}</b>
              <span className="p-1">of</span>
              <b className="">{page?.total_pages ? page?.total_pages : "1"}</b>
            </span>
            <span>
              <button
                onClick={() => clickIncCountPage()}
                disabled={page?.next_page === null ? true : false}
              >
                <MdOutlineArrowForwardIos />
              </button>
            </span>
            <span>
              <button
                onClick={() => clickLastPage()}
                className="float-right ml-3"
              >
                <BiArrowToRight />
              </button>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full ">
        <button
          onClick={() => clickNav()}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 w-1/2 my-2 sm:w-2/6 md:w-2/12 px-5 py-2 md:float-right sm:m-4"
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default Table;
