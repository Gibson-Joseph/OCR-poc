//The URL will be change. It's depends on server side

const devEnv = {
  baseURL: "https://ocr.codingtown.com"

};
const prodEnv = {
  baseURL: "https://ocr.codingtown.com"
};

const environment =
  process.env.NODE_ENV === "production" ? { ...prodEnv } : { ...devEnv };

export default environment;
