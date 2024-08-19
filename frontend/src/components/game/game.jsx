import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore'


function calculateGameFinalNetWorth(gameId) {

}

const Game = () => {
    const navigate = useNavigate()

    const endGame = async (userId, gameId) => {
        const netWorth = calculateGameFinalNetWorth(gameId)
        try {
            const response = await fetch('http://127.0.0.1:8001/core/game/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: gameId,
                    userId: userId,
                    score: netWorth,
                    currentDate: Timestamp.now().toDate(),
                    status: 'COMPLETE'         
                })
            });
            const data = await response.json();
            navigate('/endgame', {gameId: data.id})
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            Game Text
            <div>
                <button onClick={() => {}}>
                End Game
            </button>
            </div>
        </div>
    )
}

export default Game