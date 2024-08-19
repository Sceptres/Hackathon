import React, { useState } from 'react'
import { useAuth } from '../../contexts/authContext'
import { Navigate, useLocation } from 'react-router-dom'
import avatar from '../../avatar.png'


function StatComponent(props) {
    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500">{props.title}</p>
            <p className="text-xl font-semibold text-gray-800">{props.preStatText}{props.stat}</p>
        </div>
    );
}

const EndGame = () => {
    const { userLoggedIn } = useAuth();

    const getGamePortfolio = async (gameId) => {
        try {
            const response = fetch('http://127.0.0.1:8001/core/game/portfolio/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',             
                },
                body: JSON.stringify({
                    gameId: gameId
                })
            });
            const data = await response.json();
            return data;
        } catch(error) {
            console.log(error)
        }
    }

    const {gameId} = useLocation(); 
    const [portfolio, setPortfolio] = useState(() => {
        const portfolioDataRequest = getGamePortfolio(gameId);
        portfolioDataRequest.then((portfolioData) => setPortfolio(portfolioData));
        return []
    })

    if(!userLoggedIn) {
        return (
            <Navigate to={'/login'} replace={true} />
        );
    } else {
        return (
            <div className="bg-white w-ful h-full">
                <div className="flex items-center mb-4">
                <img
                    className="w-16 h-16 rounded-full"
                    src={avatar}
                    alt="Profile"
                />
                <h2 className="ml-4 text-2xl font-semibold">{user.displayName}</h2>
                </div>
        
                <div className="grid grid-cols-2 gap-4">
                    <StatComponent title='Balance' preStatText='$' stat={portfolio.balance} />
                    <StatComponent title='Score' preStatText='$' stat={} />
                    <StatComponent title='Net Profit' preStatText='$' stat={} />
                    <StatComponent title='Portfolio Stock Diversity' stat={Object.keys(portfolio.stocks).length} />
                </div>
            </div>
            
        );
    }
}

export default EndGame