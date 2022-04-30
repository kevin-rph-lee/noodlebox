import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({allowedRoles}) => {
    const {auth} = useAuth();
    const location = useLocation();

    //roles and array stored in our auth state
    //allowed roles is an array passed into it
    //seeing of allowed roles array includes


    if(auth){
        console.log('Logged in!')
        return <Outlet />
    } else {
        console.log('No Login')
        return <Navigate to="/unauthorized" state={{ from: location }} replace />
    }
}

export default RequireAuth;