import React from 'react'
import './MainPage.css'
import { Link } from 'react-router-dom'

const MainPage = () => {
  return (
    <div className='mainPage'>
      <div className='mainPageLogin'>
        <p>Already a member?</p>
        <div className='clickHereToLogin'>
          <p>Click</p>
          <Link to="/login">here</Link>
          <p>to login</p>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default MainPage