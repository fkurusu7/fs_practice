import axios from "axios";

const BASE_URL = "http://localhost:3001/notes";

const getAll = () => {
  const request = axios.get(BASE_URL);
  return request.then((res) => res.data);
};

const create = (newObj) => {
  const request = axios.post(BASE_URL, newObj);

  return request.then((res) => res.data);
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
};
