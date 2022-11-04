//The URL will be change. It's depends on server side

const devEnv = {
  baseURL:"http://143.244.141.134:3001"
};
const prodEnv = {
  baseURL:"http://143.244.141.134:3001"
};

const environment =
  process.env.NODE_ENV === "production" ? { ...prodEnv } : { ...devEnv };

export default environment;
