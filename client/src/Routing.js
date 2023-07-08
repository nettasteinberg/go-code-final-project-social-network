import React from 'react';
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';

import App from './App.js'
import { Context } from './Context.js';
import LoginPage from './pages/LoginPage/LoginPage.js';
import "./Routing.css"

const Routing = () => {

    // const navigate = useNavigate();

    return (
        <BrowserRouter>
            <Context.Provider value={{}}>
                <Link to="/" style={{ textDecoration: 'none', marginRight: 5, color: 'blue' }}>Home</Link>
                <Link to="login" style={{ textDecoration: 'none', marginRight: 5, color: 'blue' }}>Login</Link>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} /> 
                </Routes>
            </Context.Provider>
        </BrowserRouter>
    )
}

export default Routing