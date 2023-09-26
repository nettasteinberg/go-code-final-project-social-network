export const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:8002/api/" : "url from render";
export const REGISTER = process.env.NODE_ENV === "development" ? BASE_URL + "user/signIn" : "url from render";
export const LOGOUT = process.env.NODE_ENV === "development" ? BASE_URL + "user/logout" : "url from render";