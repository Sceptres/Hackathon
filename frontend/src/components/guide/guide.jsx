import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'


const Guide = () => {
    const navigate = useNavigate()
    return (
        <div>
            Guide text here
            <div>
                <button onClick={() => {navigate('/home')}}>Home</button>
            </div>
        </div>
    )
}

export default Guide