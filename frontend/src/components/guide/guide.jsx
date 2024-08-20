import { useNavigate, Navigate } from 'react-router-dom'
import GuideMarkdown from './markdown'
import { auth } from '../../firebase/firebase'

const Guide = () => {
    const navigate = useNavigate()
    const currentUser = auth.currentUser;

    if(!currentUser) {
        return <Navigate to={'/login'} replace={true} />;
    } else {
        return (
            <div>
                <div>
                    <button className="mt-2 w-full py-2 bg-gray-200 text-gray-700 rounded" onClick={() => {navigate('/home')}}>Home</button>
                </div>
                <GuideMarkdown></GuideMarkdown>
                
            </div>
        );
    }
}

export default Guide