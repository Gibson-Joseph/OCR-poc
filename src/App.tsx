import { Layout, PdfUpload, UserForm } from "./components";
import { FormComponent } from "./components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/form" element={<FormComponent />} />
      </Routes>
    </BrowserRouter>
    // <div className="">
    // <UserForm />
    // </div>
    // <FormComponent />
  );
}

export default App;
