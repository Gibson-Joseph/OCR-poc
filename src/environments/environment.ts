//The URL will be change. It's depends on server side

const devEnv = {
  baseURL: "https://ocr-project-poc.herokuapp.com",
};
const prodEnv = {
  baseURL: "https://ocr-project-poc.herokuapp.com",

};

const environment =
  process.env.NODE_ENV === "production" ? { ...prodEnv } : { ...devEnv };

export default environment;
