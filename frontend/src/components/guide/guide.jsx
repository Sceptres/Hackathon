import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import GuideMarkdown from './markdown'

const Guide = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div>
                <button className="mt-2 w-full py-2 bg-gray-200 text-gray-700 rounded" onClick={() => {navigate('/home')}}>Home</button>
            </div>
            <GuideMarkdown></GuideMarkdown>
            
        </div>
    )
}

export default Guide