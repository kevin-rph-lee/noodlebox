
import AppNavBar from './AppNavBar';
import { Outlet } from 'react-router-dom';

const Layout = (setUserState) => {
    return (
       <>
            <AppNavBar setUserState = {setUserState}/>
            <Outlet />
        </>
    )
}

export default Layout