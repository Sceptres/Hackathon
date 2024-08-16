import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { Navigate, Link } from 'react-router-dom'


const Home = () => {
    const { currentUser,userLoggedIn } = useAuth()
    return (
        <div className='text-2xl font-bold pt-14'>
            {!userLoggedIn ? (<Navigate to={'/login'} replace={true} />) : <div> Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>}

           
            </div>
    )
}

export default Home