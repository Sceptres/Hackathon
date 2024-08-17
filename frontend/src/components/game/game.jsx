import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'


const Game = () => {
    const navigate = useNavigate()
    return (
        <div>
            Game Text
            <div>
                <button onClick={() => {navigate('/endgame')}}>
                End Game
            </button>
            </div>
        </div>
    )
}

export default Game