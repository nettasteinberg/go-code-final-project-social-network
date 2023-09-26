import React from 'react'
import "./UserPage.css"
import { useParams } from 'react-router-dom';


const UserPage = () => {
    const params = useParams();
    return (
        <div>Hello, user {params.id}</div>
    )
}

export default UserPage