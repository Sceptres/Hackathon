import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    if (userLoggedIn) {
        return (
            <div className=" inline-block" style={{ width: '100%' }}>
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
            </div>
        )
    }

    return null
}

export default Header