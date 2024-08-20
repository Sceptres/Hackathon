import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { auth } from '../../firebase/firebase'
import { endUserActiveGame } from '../../help/help'


const EndGame = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    if(state) {
        const incoming = state.incoming;

        if(!incoming || incoming !== 'ENDGAME') {
            return <Navigate to={'/home'} replace={true} />;
        }
    } else {
        return <Navigate to={'/home'} replace={true} />;
    }

    const currentUser = auth.currentUser;

    endUserActiveGame(currentUser.uid);

    if(!currentUser) {
        return <Navigate to={'/login'} replace={true} />;
    } else {
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
}

export default EndGame