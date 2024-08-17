import React, { useState } from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import avatar from './avatar.png'
import './home.css'


const Home = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    const logoutUser = () => {
        doSignOut().then(() => {
            navigate('/login');
        });
    };

    const getLeaderboard = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/core/leaderboard/get', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',             
                },
            });
            const data = await response.json();
            return data
        } catch(error) {
            console.log('Unknown error')
        }
    }

    const [leaderboard, setLeaderboard] = useState(() => {
        const data = getLeaderboard();
        data.then((arr) => {
            setLeaderboard(arr)
        })
        return []
    })

    if(!userLoggedIn) {
        return (
            <Navigate to={'/login'} replace={true} />
        );
    } else {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
                <div className="bg-white w-full h-full">
                    <div className="w-full flex justify-between items-center pb-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-center flex-grow text-gray-800">Leaderboard</h1>
                        <button
                            onClick={logoutUser}
                            className="text-white bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
    
                    <ul className="overflow-y-scroll scrollbar-hide w-full mt-8">
                        {
                            leaderboard.map((element, index) => 
                            (<LeaderboardItem 
                                key={element.id}
                                index={index} 
                                displayName={element.displayName} 
                                img={avatar} 
                                highscore={element.highscore}/>)
                            )
                        }
                    </ul>
                    <div className="mt-4 flex justify-center">
                        <button className="text-white bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 transition duration-300">
                            Start Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};

function LeaderboardItem(props) {
    return (
        <li className="bg-gray-50 shadow-sm rounded-lg p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center">
                <span className="font-medium text-base text-gray-700 mr-4">{props.index + 1}.</span>
                <img
                    src={props.img}
                    alt="Profile Picture"
                    className="w-10 h-10 rounded-full border-2 border-gray-200 mr-4"
                />
                <span className="font-medium text-base text-gray-800">{props.displayName}</span>
            </div>
            <span className="font-semibold text-lg text-gray-700">Highscore: ${props.highscore}</span>
        </li>
    );
}

export default Home