import React, {createContext, useState} from 'react';

const UserContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);

function UserProvider({ children }) {
    const [userDetails, setUserDetails] = useState({
        isLoggedIn: false,
        email: '',
        logintime: '',
        accessToken: '',
        displayName: '',
        providerId: '',
    });

    return (
        <UserContext.Provider value={userDetails}>
            <UserDispatchContext.Provider value={setUserDetails}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}

export { UserProvider, UserContext, UserDispatchContext };




// const AuthContext =  React.createContext();
//
// export const useAuth = () => {
//     useContext(AuthContext);
// }
//
// export const AuthProvider = ({ children }) => {
//     const [currentUser, setCurrentUser ] = useState();
//
//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(user => {
//             setCurrentUser(user)
//             console.log(user);
//         })
//         return unsubscribe()
//     }, []);
//
//
//
//
//     const value = { currentUser }
//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

