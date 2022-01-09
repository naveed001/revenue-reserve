import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./Signup";
import HomeScreen from "./HomeScreen";
import { UserContext } from "../contexts/AuthContext";

export function RoutesApp() {
    const userDetails = useContext(UserContext);

    return (
        <Routes>
            <Route path="/login" element={<SignIn />} />
            <Route path="/companies/:id" element={<HomeScreen />} />
            {/* <Route path="/companies/:id" element={userDetails.isLoggedIn ? <HomeScreen /> : <Navigate replace to="/login" />} /> */}
            <Route exact path="/" element={userDetails.isLoggedIn ? <Navigate replace to="/companies/list" /> : <Navigate replace to="/login" />} />
            <Route path="*" element={userDetails.isLoggedIn ? <Navigate replace to="/companies/list" /> : <Navigate replace to="/login" />} />
        </Routes>
    );
}
