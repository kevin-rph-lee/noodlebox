
import AppNavBar from './AppNavBar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = () => {
    return (
       <>
            <AppNavBar />
            <Footer />
            <Outlet />
        </>
    )
}

export default Layout