import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { store } from "./redux/store";
import { Provider } from "react-redux";

import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
    <ToastContainer/>
  </Provider>
);

reportWebVitals();
serviceWorker.unregister();
