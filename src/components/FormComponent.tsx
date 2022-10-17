import { useEffect, useState } from "react";
import Api from "../helpers/interceptor/interceptor";
import { UserForm } from "./";
import { PdfUpload } from "./";
import loadinSpinner from "../assets/refresh.svg";
import toastMsg from "../service/toast/toast";
import { ToastContainer } from "react-toastify";

const FormComponent = () => {
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [pdfFileErr, setPdfFileErr] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();
  const [resErr, setResErr] = useState<boolean>(false);
  const [back, setBack] = useState<boolean>(false);

  useEffect(() => {
    if (pdfFile !== null) {
      if (pdfFile["0"].type !== "application/pdf") {
        setPdfFileErr(true);
      } else {
        setPdfFileErr(false);
        console.log("Api calling-----");
        pdfFile !== null && console.log("pdfFile.file.type---", pdfFile["0"]);
        const formData = new FormData();
        formData.append("file", pdfFile["0"]);

        console.log("formData--", formData);

        Api("/v1/save_pdf", {
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((data: any) => {
            setUserData(data.data);
            setBack(true);
            console.log(userData);
          })
          .catch((err) => {
            console.log("response err", err);
            toastMsg("error", "Could not upload file please enter manualy");
            setResErr(true);
            setBack(true);
          });
      }
    }
  }, [pdfFile]);

  return (
    <div className="h-screen">
      <ToastContainer />
      <header className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 h-12 flex">
        <h1 className="text-white font-bold text-2xl italic w-full block text-center">
          Add Your Detail
        </h1>
      </header>
      <div className="w-full h-full">
        {!back && (pdfFile === null || pdfFileErr) && (
          <PdfUpload setPdfFile={setPdfFile} pdfFileErr={pdfFileErr} />
        )}
        {back &&
          ((pdfFile !== null && !pdfFileErr && userData !== undefined) ||
            resErr) && (
            <UserForm
              userData={userData}
              setPdfFile={setPdfFile}
              setBack={setBack}
              back={back}
            />
          )}

        {pdfFile !== null && !pdfFileErr && userData === undefined && !resErr && (
          <div className="w-full h-full flex justify-center items-center">
            <img
              className="animate-spin h-12"
              src={loadinSpinner}
              alt="loading ..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormComponent;
