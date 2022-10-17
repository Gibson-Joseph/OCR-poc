import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastMsg = (status, name = "name") => {
  if (status === "success") {
    toast.success(`${name} Successfully data Stored`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      className: "bg-green-200",
    });
  }

  if (status === "error") {
    toast.error(`Error ${name}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      className: "bg-red-200",
    });
  }
};
export default toastMsg;
