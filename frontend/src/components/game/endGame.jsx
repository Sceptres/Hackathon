import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { Navigate } from 'react-router-dom'
import avatar from '../../avatar.png'


function StatComponent(props) {
    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500">{props.title}</p>
            <p className="text-xl font-semibold text-gray-800">{props.preStatText}{props.stat}</p>
        </div>
    );
}

const EndGame = (props) => {
    const { userLoggedIn } = useAuth();

    if(!userLoggedIn) {
        return (
            <Navigate to={'/login'} replace={true} />
        );
    } else {
        const user = {
            profilePic: "https://via.placeholder.com/150", // Placeholder image URL
            displayName: "John Doe",
            stats: {
              balance: 10000,
              score: 12000,
              netProfit: 2000,
              totalProfit: 5000,
              totalLoss: 3000,
              totalTrades: 50,
            },
          };
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
                    <StatComponent title='Balance' preStatText='$' stat={user.stats.balance} />
                    <StatComponent title='Score' preStatText='$' stat={user.stats.score} />
                    <StatComponent title='Net Profit' preStatText='$' stat={user.stats.netProfit} />
                    <StatComponent title='Total Trades' stat={user.stats.totalTrades} />
                </div>
            </div>
            
        );
    }
}

export default EndGame