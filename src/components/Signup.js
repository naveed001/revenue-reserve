import React, {useContext, useState} from 'react';
import { Button, Card } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, getAuth, signOut  } from "firebase/auth";
import {analytics, auth} from "../firebaseConfig";
import {UserContext , UserDispatchContext} from "../contexts/AuthContext";
import { logEvent } from "firebase/analytics";

const Signup = () => {

    let navigate = useNavigate();
    const userDetails = useContext(UserContext);
    const setUserDetails = useContext(UserDispatchContext);
    const [ error, setError ] = useState('');
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                const user = result.user;
                window.sessionStorage.setItem("emailForSignIn", result.user.email);
                if (result._tokenResponse.isNewUser) {
                    logEvent(analytics,"NewSignUp", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        signUpTime: user.metadata.creationTime,
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                } else {
                    logEvent(analytics,"Login", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        loginTime: new Date(user.metadata.lastLoginAt),
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                }

                // setUserDetails({isLoggedIn: true, email: user.email,
                //     displayName: user.displayName, loginTime: user.metadata.lastLoginAt, acccesToken: user.accessToken,
                //     providerId: user.providerData[0].providerId});
                navigate('/companies/list');
            }).catch((error) => {
            console.error(error);
            const errorCode = error.code;
            if (error.code === 'auth/account-exists-with-different-credential') {
                let loginWithFB = window.confirm("You have already signed up with facebook with same credentials, login with facebook");
                if (loginWithFB) {
                    signInWithFacebook();
                }
            }
        });
    }
    const signInWithFacebook = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                const user = result.user;
                window.sessionStorage.setItem("emailForSignIn", result.user.email);
                if (result._tokenResponse.isNewUser) {
                    logEvent(analytics,"SignUp", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        signUpTime: user.metadata.creationTime,
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                } else {
                    logEvent(analytics,"Login", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        loginTime: new Date(user.metadata.lastLoginAt),
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                }
                // setUserDetails({isLoggedIn: true, email: user.email,
                //     displayName: user.displayName, loginTime: user.metadata.lastLoginAt, acccesToken: user.accessToken,
                //     providerId: user.providerData[0].providerId});
                navigate('/companies/list');
            }).catch((error) => {
            console.error(error);
            const errorCode = error.code;
            if (error.code === 'auth/account-exists-with-different-credential') {
                let loginWithGoogle = window.confirm("You have already signed up with google with same credentials, login with google");
                if (loginWithGoogle) {
                    signInWithGoogle();
                }
            }
        });
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h1 className="text-center"> Login </h1>
                    <Button className="btn-primary w-100 mt-4" onClick={signInWithGoogle}> Login with Google</Button>
                    <Button className="btn-primary w-100 mt-4" onClick={signInWithFacebook}> Login with Facebook</Button>
                </Card.Body>
            </Card>
        </>
    );
};

export default Signup;