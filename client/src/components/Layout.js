
import AppNavBar from './AppNavBar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = ({joinSocketRoom}) => {
    return (
       <>
            <AppNavBar joinSocketRoom = {joinSocketRoom}/>
            <Footer />
            <Outlet />
        </>
    )
}

export default Layout