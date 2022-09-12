import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';


const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        //Set isMounted to true, triggering the uuse effect below
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                console.log('Refreshing token...1')
                await refresh();
                console.log('Token ' + auth.accessToken )
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // If not access fnction, call verify refreshtoken to see if it's correct and get an access token
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [])


    useEffect(() =>{
        // console.log(`is Loading ${isLoading}` )
        // console.log(`Access TOken ${JSON.stringify(auth?.accessToken)}` )
    }, [isLoading])


    //Show's a loading div while grabbing the access token from the backend. 
    return(
        <>
            {isLoading 
            ? <p>Loading...</p> 
            : <Outlet />}
        </>
    )
}

export default PersistLogin