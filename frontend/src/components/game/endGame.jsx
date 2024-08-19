import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { useNavigate, Navigate } from 'react-router-dom'


const EndGame = () => {
    const navigate = useNavigate()

    return (
        <div>Game Over!

            Stats

            <button onClick={() => {navigate('/home')}}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                Home
            </button>
        </div>
    );   
}

export default EndGame