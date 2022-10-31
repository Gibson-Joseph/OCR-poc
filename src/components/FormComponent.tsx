import { useEffect, useState } from "react";
import Api from "../helpers/interceptor/interceptor";
import { UserForm } from "./";
import { PdfUpload } from "./";
import loadinSpinner from "../assets/refresh.svg";
import toastMsg from "../service/toast/toast";
import { ToastContainer } from "react-toastify";
import Scanner from "../Scanner";

const FormComponent = () => {
  const [userData, setUserData] = useState<any>();
  const [back, setBack] = useState<boolean>(false);


  return (
    <div className="h-screen">
      <ToastContainer />
      <header className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 h-12 flex">
        <h1 className="text-white font-bold text-2xl italic w-full block text-center">
          Add Your Detail
        </h1>
      </header>
      <div className="w-full h-full">

<Scanner setUserData={setUserData} setBack={setBack} />

      </div>
    </div>
  );
};

export default FormComponent;
