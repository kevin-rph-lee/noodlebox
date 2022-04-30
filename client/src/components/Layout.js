
import AppNavBar from './AppNavBar';
import { Outlet } from 'react-router-dom';

const Layout = (setUserState) => {
    return (
        <div className="App">
            <AppNavBar setUserState = {setUserState}/>
            <Outlet />
        </div>
    )
}

export default Layout