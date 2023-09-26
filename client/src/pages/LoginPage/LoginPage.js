import React from 'react'
import Login from '../../components/Login/Login.js'
import { BASE_URL } from '../../constants/api.js'
import MainPage from '../MainPage/MainPage.js';
import cors from "cors";

const user = false;
const verifyLogin = async () => {
  try {
    const url = `${BASE_URL}user/jwt`;
    console.log("url ", url);
    const response = await fetch(url, { credentials: "include" });
    const user = await response.json();
    console.log(response);
    return user;
    // console.log("get all posts response:", data);
  } catch (e) {
    console.log(e.message, e);
  }
}

const verifiedLogin = verifyLogin();
// console.log(verifiedLogin);

const LoginPage = () => {
  return (
    // verifiedLogin ? "verified" : "not verified"
    // <MainPage user={user}/> :
    <Login />
  )
}

export default LoginPage