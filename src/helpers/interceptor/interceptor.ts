import axios from "axios";
import environment from "../../environments/environment";

const Api = axios.create({
  baseURL: environment.baseURL,
});

Api.interceptors.request.use(
  (request: any) => {
    console.log("request", request);

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response: any) => {
    console.log("response", response);

    return response;
  },
  (error) => {
    console.log("Not Found");
    return Promise.reject(error);
  }
);

export default Api;
