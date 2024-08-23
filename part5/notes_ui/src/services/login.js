import axios from "axios";
const BASE_PATH = "/api/login";

const login = async (credentials) => {
  try {
    const res = await axios.post(BASE_PATH, credentials);
    console.log("RES: \n", res);

    return res.data;
  } catch (error) {
    console.log("LOGIN error: ", error);
    throw error;
  }
};
export default { login };
