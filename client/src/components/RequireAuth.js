import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({allowedRoles}) => {
    const {auth} = useAuth();
    const location = useLocation();

    //roles and array stored in our auth state
    //allowed roles is an array passed into it
    //seeing of allowed roles array includes


    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
}

export default RequireAuth;