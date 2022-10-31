import { Layout, PdfUpload, UserForm } from "./components";
import { FormComponent } from "./components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";

function App() {

  const [val, setVal] = useState<any>("");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/scanner" element={<FormComponent />} />
        <Route path="/form" element={<UserForm/>}/>
      </Routes>
    </BrowserRouter>



    // <div>
    //   <input
    //     type="text"
    //     pattern="[0-9]*"
    //     className="border border-black"
    //     value={val}
    //     onChange={(e) =>
    //       setVal((v: number) => (e.target.validity.valid ? e.target.value : v))
    //     }
    //   />
    // </div>
  );
}

export default App;
