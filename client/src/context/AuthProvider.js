import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    //Children componenets nested within the auth provider
    const [auth, setAuth] = useState({});

    return(
        <AuthContext.Provider value = {{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;