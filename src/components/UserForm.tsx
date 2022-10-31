import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate,useLocation } from "react-router-dom";

import Api from "../helpers/interceptor/interceptor";
import toastMsg from "../service/toast/toast";
import { ToastContainer } from "react-toastify";

import "../style/style.css";

type FormValue = {
  name: string;
  door_no: string;
  address: string;
  city: string;
  pin_code: string;
  taluk: string;
  district: string;
  mobile: string;
  landline: string;
  email: string;
};

const UserForm = ({ userData, setBack, back }: any) => {
  console.log("form State----", userData);
const location=useLocation()
console.log("location.state",location.state);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<FormValue>({
  //   defaultValues: {
  //     name: userData?.data?.row.Name,
  //     door_no: userData?.data?.row.Door_No,
  //     address: userData?.data?.row.Address,
  //     city: userData?.data?.row.City,
  //     pin_code: userData?.data?.row.Pincode,
  //     taluk: userData?.data?.row.Taluk,
  //     district: userData?.data?.row.District,
  //     mobile: userData?.data?.row.Mobile,
  //     landline: userData?.data?.row.Landline,
  //     email: userData?.data?.row["e-mail"],
  //   },
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      name: location.state?.data?.row.Name,
      door_no: location.state?.data?.row.Door_No,
      address: location.state?.data?.row.Address,
      city: location.state?.data?.row.City,
      pin_code: location.state?.data?.row.Pincode,
      taluk: location.state?.data?.row.Taluk,
      district: location.state?.data?.row.District,
      mobile: location.state?.data?.row.Mobile,
      landline: location.state?.data?.row.Landline,
      email: location.state?.data?.row["e-mail"],
    },
  });

  const navigate = useNavigate();

  const backNavigation = () => {
    navigate("/");
    // setPdfFile(null);
    // setBack(!back);
  };

  const onSubmit = (data: FormValue) => {
    Api("/v1/customers", {
      method: "POST",
      data: data,
    })
      .then((res) => {
        console.log(res.data);
        let name = res.data.name.split(" ");
        toastMsg("success", name[0]);
        navigate("/");
      })
      .catch((err) => {
        toastMsg("error");
        console.log(err);
      });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <ToastContainer />
      <form
        action=""
        className="w-[95%] sm:h-[65%] sm:p-5 md:w-[75%] lg:w-[70%] py-4 rounded-lg md:border md:shadow-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="sm:grid grid-cols-2 gap-x-12 gap-y-4">
          <div className=" col-span-2 input-box">
            <label htmlFor="">Name</label>
            <input
              className=""
              type="text"
              placeholder="Enter your Name"
              {...register("name", { required: true })}
            />
            <span>{errors.name?.type === "required" && "required"}</span>
          </div>

          <div className="input-box">
            <label htmlFor="">Mobile</label>
            <input
              type="text"
              placeholder="Enter Mobile No"
              {...register("mobile", { required: true })}
            />
            <span>{errors.mobile?.type === "required" && "required"}</span>
          </div>
          <div className="input-box">
            <label htmlFor="">Landline</label>
            <input
              type="text"
              placeholder="Enter landline No"
              {...register("landline", { required: true })}
            />
            <span>{errors.landline?.type === "required" && "required"}</span>
          </div>

          <div className="input-box">
            <label htmlFor="">Door No</label>
            <input
              className=""
              type="text"
              placeholder="Enter your doorNo"
              {...register("door_no", { required: true })}
            />
            <span>{errors.door_no?.type === "required" && "required"}</span>
          </div>

          <div className="input-box">
            <label htmlFor="">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />
            <span>{errors.email?.type === "required" && "required"}</span>
          </div>

          <div className="input-box">
            <label htmlFor="">City</label>
            <input
              type="text"
              placeholder="Enter your city"
              {...register("city", { required: true })}
            />
            <span>{errors.city?.type === "required" && "required"}</span>
          </div>
          <div className="input-box">
            <label htmlFor="">Distrit</label>
            <input
              type="text"
              placeholder="Enter your distrit"
              {...register("district", { required: true })}
            />
            <span>{errors.district?.type === "required" && "required"}</span>
          </div>

          <div className="input-box">
            <label htmlFor="">Taluk</label>
            <input
              type="text" 
              placeholder="Enter your taluk"
              {...register("taluk", { required: true })}
            />
            <span>{errors.taluk?.type === "required" && "required"}</span>
          </div>

          <div className="input-box">
            <label htmlFor="">Pincode</label>
            <input
              type="text"
              placeholder="Enter your pincode"
              {...register("pin_code", { required: true })}
            />
            <span>{errors.pin_code?.type === "required" && "required"}</span>
          </div>
          <div className="col-span-2 input-box">
            <label htmlFor="">Address</label>
            <textarea
              className="border border-black w-full h-28"
              placeholder="Enter your address"
              {...register("address", { required: true })}
            />
            <span>{errors.address?.type === "required" && "required"}</span>
          </div>
        </div>
        <div className="w-full flex justify-center sm:justify-end mt-2">
          <button
            type="button"
            className="bg-gray-300 border px-10 font-bold py-2 rounded-md mr-4"
            onClick={() => backNavigation()}
          >
            back
          </button>
          <button
            className="bg-blue-300 border px-6 py-2 font-bold rounded-md"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
