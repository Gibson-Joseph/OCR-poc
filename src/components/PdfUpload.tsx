import React, { useState } from "react";

const PdfUpload = ({ setPdfFile, pdfFileErr,setPath }: any) => {

  return (
    <div className="max-w-xl flex flex-col justify-center items-center m-auto h-full">
      <label
        className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 ${pdfFileErr ? "border-red-500" : "border-gray-300"
          }  border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none items-center`}
      >
        <span className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="font-medium text-gray-600">
            Drop files to Attach, or
            <span className="text-blue-600 underline">browse</span>
          </span>
        </span>
        <input
          required
          onChange={(e: any) => {
            setPath(URL.createObjectURL(e.target.files["0"]))
            // console.log("path", path);
            setPdfFile(e.target.files)
          }}
          type="file"
          name="file_upload"
          className="hidden"
        />
      </label>
      <span className="text-red-500 text-sm text-center">
        {pdfFileErr && "Please select PDF file Only"}
      </span>
    </div>
  );
};

export default PdfUpload;
