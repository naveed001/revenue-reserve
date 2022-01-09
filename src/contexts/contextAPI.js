import React, {createContext, useEffect, useState} from "react";
import {auth} from "../firebaseConfig";

export const AuthContext = createContext();

export const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            setLoading(false)
        });
    }, []);

    if (loading) {
        return <>Loading...</>
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};