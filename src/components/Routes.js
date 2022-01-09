import React, {useContext} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import SignIn from "./Signup";
import HomeScreen from "./HomeScreen";
import {AuthContext} from "../contexts/contextAPI";

export function RoutesApp() {
    const {currentUser} = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/login" element={<SignIn/>}/>
            {
                currentUser ?
                    <>
                        <Route path="/companies" element={<HomeScreen/>}>
                            <Route path=":id" element={<HomeScreen/>}/>
                        </Route>
                        {/*<Route path="/companies/:id"*/}
                        {/*       element={currentUser ? <HomeScreen/> : <Navigate replace to="/login"/>}/>*/}
                        <Route exact path="/" element={<Navigate replace to="/companies"/>}/>
                        <Route path="*" element={<Navigate replace to="/companies"/>}/>
                    </> :
                    <Route path="*" element={<Navigate replace to="/login"/>}/>
            }

        </Routes>
    );
}
