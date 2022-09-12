import axios from '../api/axios';
import useAuth from './useAuth';
// import { SocketContext } from '../context/SocketProvider';
// import { useContext } from 'react';

// const socket = useContext(SocketContext);

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        console.log('calling axios for refresh token')
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            return { ...prev, accessToken: response.data.accessToken, role: response.data.role, userName: response.data.userName, userID: response.data.userID }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;