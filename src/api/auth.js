import API from "./axios";

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Basic ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};