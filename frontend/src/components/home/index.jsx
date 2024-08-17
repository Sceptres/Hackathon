import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate()
    const { currentUser,userLoggedIn } = useAuth()
    return (
        <div className='text-2xl font-bold pt-14'>
                            <button 
                    onClick={() => { 
                        doSignOut().then(() => { 
                            navigate('/login') 
                        }) 
                    }} 
                    className="absolute top-1 right-1 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block"
                >
                    Logout
                </button>
            {!userLoggedIn ? (<Navigate to={'/login'} replace={true} />) : <div> Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>}

           
            </div>
    )
}

export default Home