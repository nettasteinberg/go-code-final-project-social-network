import React from 'react';
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';

import App from './App.js'
import { Context } from './Context.js';
import LoginPage from './pages/LoginPage/LoginPage.js';
import "./Routing.css"
import Login from './components/Login/Login.js';
import UserPage from './pages/UserPage/UserPage.js';
import MainPage from './pages/MainPage/MainPage.js';

const Routing = () => {

    

    return (
        <BrowserRouter>
            <Context.Provider value={{}}>
                <Link to="/" >Home</Link>
                <Link to="login" >Sign in/Login</Link>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="user/:id" element={<UserPage/>} />
                    <Route path="*" element={<Navigate to="/" replace />} /> 
                </Routes>
            </Context.Provider>
        </BrowserRouter>
    )
}

export default Routing