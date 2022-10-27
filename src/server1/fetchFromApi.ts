import axios from "axios";
import environment from "../environments/environment";
const BASE_URL = environment.baseURL;

export const fetchFromAPI = async (url: any) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`);

  return data;
};
