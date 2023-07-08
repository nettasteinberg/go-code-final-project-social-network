import React from 'react'
import './Login.css'
import { REGISTER } from '../../constants/api';

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
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    console.log(await response.json());
}


const Login = () => {
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
                <input type="email" placeholder='example@gmail.com' className='loginEmail' defaultValue="example@gmail.com"/>
            </div>
            <div className="loginInput">
                <label>
                    Password:
                </label>
                <input type="password" placeholder='Password' autoComplete="on" className='loginPassword' defaultValue="johndoepassword1!A" />
            </div>
            <button onClick={async () => await createUser()}>Submit</button>
        </div>
    )
}

export default Login