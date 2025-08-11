import axios from "axios";

// function inferBaseURL() {
//   const env = process.env.REACT_APP_LOCAL_BACKEND;
//   // env가 있고 'localhost'가 아니면 그대로 사용
//   if (env && !/localhost|127\.0\.0\.1/i.test(env)) return env;

//   // 그렇지 않으면 현재 접속한 호스트(IP/도메인)로 구성
//   const { protocol, hostname } = window.location; // ex) http://192.168.0.23:3000
//   const port = process.env.REACT_APP_API_PORT || "5000";
//   return `${protocol}//${hostname}:${port}/api`;
// }

// const api = axios.create({
//   baseURL: inferBaseURL(),
//   headers: {
//     "Content-Type": "application/json",
//     authorization: `Bearer ${sessionStorage.getItem("token")}`,
//   },
// });

// 상황따라 주소 다름
// const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;
const PROD_BACKEND = process.env.REACT_APP_PROD_BACKEND;
// const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY;
const api = axios.create({
  baseURL: PROD_BACKEND,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});

api.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    request.headers.authorization = `Bearer ${sessionStorage.getItem("token")}`;
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("RESPONSE ERROR", error);
    return Promise.reject(error);
  }
);

export default api;
