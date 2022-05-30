
import AppNavBar from './AppNavBar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = (setUserState) => {
    return (
       <>
            <AppNavBar setUserState = {setUserState}/>
            <Footer />
            <Outlet />
        </>
    )
}

export default Layout