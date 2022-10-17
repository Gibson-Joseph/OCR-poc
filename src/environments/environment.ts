//The URL will be change. It's depends on server side

const devEnv = {
    baseURL: 'http://192.168.1.239:3001',
  };
  const prodEnv = {
    baseURL: 'http://192.168.1.239:3001',
  };
  
  const environment =
    process.env.NODE_ENV === 'production' ? { ...prodEnv } : { ...devEnv };
  
  export default environment;
  