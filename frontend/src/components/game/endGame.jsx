import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { endGame } from '../../api/api'
import { formatNumberToUSD } from '../../help/help'
import avatar from '../../avatar.png'


function StatComponent(props) {
    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500">{props.title}</p>
            <p className="text-xl font-semibold text-gray-800">{props.stat}</p>
        </div>
    );
}

const EndGame = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const [portfolio, setPortfolio] = useState()

    const currentUser = auth.currentUser;

    useEffect(() => {
        document.title = "Game Over!"
        if(state) {
            const gameId = state.gameId;
    
            if(!gameId) {
                navigate('/home', {replace: true});
            } else {
                const portfolioDataRequest = endGame(gameId);
                portfolioDataRequest.then((portfolioData) => {
                    console.log(portfolioData)
                    setPortfolio(portfolioData)
                });
            }
        } else {
            return navigate('/home', {replace: true});
        }
    }, [])

    if(!currentUser) {
        return <Navigate to={'/login'} replace={true} />;
    } else {
        return (
            <>
                <div className="flex flex-col items-center justify-center bg-gray-100">
                    <div className="text-2xl font-bold pt-14">
                        <button onClick={() => { navigate('/home') }}
                            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                            Leaderboard
                        </button>
                        <button onClick={() => { navigate('/guide') }}
                            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                            Read the Investment Guide!
                        </button>
                    </div>
                </div>
                <div className="bg-white w-ful h-full">
                    {portfolio && portfolio.achievedNewHighScore && (
                        <p className="text-lg font-medium text-green-600 text-center mb-4">
                            🎉 Congratulations! You have achieved a new highscore! 🎉
                            </p>)}
                    <div className="flex items-center mb-4">
                        <img
                            className="w-16 h-16 rounded-full"
                            src={avatar}
                            alt="Profile"
                        />
                        <h2 className="ml-4 text-2xl font-semibold">{currentUser.displayName || currentUser.email}</h2>
                    </div>
            
                    <div className="grid grid-cols-2 gap-4">
                        <StatComponent title='Balance' stat={portfolio && formatNumberToUSD(portfolio.balance)} />
                        <StatComponent title='Score | Net Worth' stat={portfolio && formatNumberToUSD(portfolio.score)} />
                        <StatComponent title='Net Profit' stat={portfolio && formatNumberToUSD(portfolio.score-portfolio.initBalance)} />
                        <StatComponent title='Portfolio Stock Diversity' stat={portfolio && Object.keys(portfolio.stocks).length} />
                    </div>
                </div>
            </>
        );
    }   
}

export default EndGame