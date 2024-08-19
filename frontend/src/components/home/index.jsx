import React, { useEffect, useState } from 'react'
import { auth } from "../../firebase/firebase";
import { doSignOut } from '../../firebase/auth'
import { useNavigate, Navigate } from 'react-router-dom'
import avatar from './avatar.png'
import './home.css'


const Home = () => {
    const navigate = useNavigate();

    const logoutUser = () => {
        doSignOut().then(() => {
            navigate('/login');
        });
    };

    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
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

        const data = getLeaderboard();
        data.then((arr) => {
            setLeaderboard(arr)
        })
    }, [])

    const currentUser = auth.currentUser;

    if(!currentUser) {
        return <Navigate to={'/login'} replace={true} />;
    } else {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <div className='text-2xl font-bold pt-14'>
                    <button onClick={() => {navigate('/game')}}
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                        Start Game
                    </button>
                    <button onClick={() => {navigate('/guide')}}
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                        Read the Investment Guide!
                    </button>
                </div>
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