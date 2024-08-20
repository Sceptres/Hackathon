import React, { useEffect, useState } from 'react'
import { auth } from "../../firebase/firebase";
import { doSignOut } from '../../firebase/auth'
import { useNavigate, Navigate } from 'react-router-dom'
import { getLeaderboard, getUserActiveGame, createUserGame } from '../../api/api'
import { getDate, dateToStringFormat, formatNumberToUSD } from '../../help/help';
import avatar from '../../avatar.png'
import './home.css'


const Home = () => {
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    const logoutUser = () => {
        doSignOut().then(() => {
            navigate('/login');
        });
    };

    const [isRunningGame, setIsRunningGame] = useState(null); // To store fetched data

    let startDate = getDate("2005-10-10");
    startDate = dateToStringFormat(startDate);

    const start_game = async() => {
        try {
            const data = await createUserGame(currentUser.uid, startDate);
            
            if(Object.keys(data).length === 0){
                setIsRunningGame(false)
            }
            else{
                setIsRunningGame(true)
            }
            navigate('/game', {replace: true});
          } catch (error) {
            console.error('Error:', error);
          }
    }

    const continueGameOnClick = async () => {
        try {
            const data = await getUserActiveGame(currentUser.uid);

            if(Object.keys(data).length === 0){
                setIsRunningGame(false)
            } else{
                setIsRunningGame(true)
            }

            navigate('/game', {replace: true});
        } catch(error) {
            console.error('Error:', error);
        }   
    };

    useEffect(() => {
        document.title = "Leaderboard | Home"
        const fetchData = async () => {
            try {
                const data = await getUserActiveGame(currentUser.uid)
                
                if(Object.keys(data).length === 0){
                    setIsRunningGame(false)
                } else{
                    setIsRunningGame(true)
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
      
        fetchData();
    } , []);

    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        const getLeaderboardRequest = async () => {
            try {
                const data = await getLeaderboard();
                return data
            } catch(error) {
                console.log('Unknown error')
            }
        }

        const data = getLeaderboardRequest();
        data.then((arr) => {
            setLeaderboard(arr)
        })
    }, [])

    if(!currentUser) {
        return <Navigate to={'/login'} replace={true} />;
    } else {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <div className='text-2xl font-bold pt-14'>
                {isRunningGame && isRunningGame != null ? (
                                   <button onClick={continueGameOnClick}
                                   className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
                               Continue Game
                           </button>

            ) :null}       {!isRunningGame && isRunningGame != null?  (           <button onClick={start_game}
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 inline-block">
        Start Game
    </button>):null}
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
            <span className="font-semibold text-lg text-gray-700">Highscore: {formatNumberToUSD(props.highscore)}</span>
        </li>
    );
}

export default Home