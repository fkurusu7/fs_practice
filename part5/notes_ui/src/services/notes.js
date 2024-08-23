import axios from "axios";
const BASE_URL = "/api/notes";

let token = null;

const setToken = (newToken) => (token = `Bearer ${newToken}`);

const getAll = () => {
  const request = axios.get(BASE_URL);
  return request.then((res) => res.data);
};

const create = async (newObj) => {
  // const request = axios.post(BASE_URL, newObj);
  // return request.then((res) => res.data);
  const config = { headers: { Authorization: token } };
  const res = await axios.post(BASE_URL, newObj, config);
  return res.data;
};

const update = (id, newObj) => {
  console.log("id", id);
  console.log("New object", newObj);
  const request = axios.put(`${BASE_URL}/${id}`, newObj);
  return request.then((res) => {
    console.log(res);
    return res.data;
  });
};

export default {
  getAll,
  create,
  update,
  setToken,
};
