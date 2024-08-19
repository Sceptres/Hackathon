import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { auth } from '../../firebase/firebase'


const Guide = () => {
    const navigate = useNavigate()
    const currentUser = auth.currentUser;

    if(!currentUser) {
        return <Navigate to={'login'} replace={true} />;
    } else {
        return (
            <div>
                Guide text here
                <div>
                    <button onClick={() => {navigate('/home')}}>Home</button>
                </div>
            </div>
        );
    }
}

export default Guide