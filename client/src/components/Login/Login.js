import React from 'react'
import './Login.css'
import { LOGOUT, REGISTER } from '../../constants/api';
import { useNavigate } from 'react-router-dom';

const createUser = async () => {
    const loginFullName = document.querySelector(".loginFullName");
    const loginEmail = document.querySelector(".loginEmail");
    const loginPassword = document.querySelector(".loginPassword");
    const data = {};
    data["fullName"] = loginFullName.value;
    data["email"] = loginEmail.value;
    data["password"] = loginPassword.value;
    const response = await fetch(REGISTER, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const user = await response.json();
    // console.log(user._id.toString());
    return user;
}

const deleteAllUsers = async () => {
    try {
        const response = await fetch(`http://localhost:8002/api/users`, { method: "DELETE", credentials: "include" });
        const data = await response.json();
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}

const logOut = async () => {
    const response = await fetch(LOGOUT, {
        method: "DELETE",
        credentials: 'include'
    });
    const deletedUser = await response.json();
    console.log(`deleted user ${deletedUser._id}`);
}

const getAllPostsByUserId = async () => {
    try {
        const response = await fetch(`http://localhost:8002/api/posts/64b578ef8011f4f59e23494b`, { method: "GET", credentials: "include" });
        const data = await response.json();
        console.log("get all posts response:", data);
    } catch (e) {
        console.log(e)
    }
}

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="divLoginInput">
            Login
            <div className="loginInput">
                <label>
                    Full name:
                </label>
                <input type="text" placeholder='Full name' className='loginFullName' defaultValue="Abra Kadabra" />
            </div>
            <div className="loginInput">
                <label>
                    Email:
                </label>
                <input type="email" placeholder='example@gmail.com' className='loginEmail' defaultValue="example@gmail.com" />
            </div>
            <div className="loginInput">
                <label>
                    Password:
                </label>
                <input type="password" placeholder='Password' autoComplete="on" className='loginPassword' defaultValue="johndoepassword1!A" />
            </div>
            <button onClick={async () => {
                const newUser = await createUser();
                navigate(`user/${newUser._id}`);
            }}>Submit</button>
            <button onClick={async () => await getAllPostsByUserId()}>Get posts</button>
            <button onClick={async () => await logOut()}>Logout</button>
            <button onClick={async () => await deleteAllUsers()}>Delete all users</button>
        </div>
    )
}

export default Login