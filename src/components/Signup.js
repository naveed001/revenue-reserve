import React, {useContext, useState} from 'react';
import {Alert, Button, Card} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {signInWithPopup, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth";
import {analytics, auth} from "../firebaseConfig";
import {logEvent} from "firebase/analytics";

const Signup = () => {
    let navigate = useNavigate();
    const [error, setError] = useState("");
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                const user = result.user;
                if (result._tokenResponse.isNewUser) {
                    logEvent(analytics, "NewSignUp", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        signUpTime: user.metadata.creationTime,
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                } else {
                    logEvent(analytics, "Login", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        loginTime: new Date(user.metadata.lastLoginAt),
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                }
                navigate('/companies');
            }).catch((error) => {
            console.error(error);
            if (error.code === 'auth/account-exists-with-different-credential') {
                setError("You have already signed up with facebook with same credentials, login with facebook");
            } else {
                setError("try again");
            }
        });
    }
    const signInWithFacebook = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                const user = result.user;
                if (result._tokenResponse.isNewUser) {
                    logEvent(analytics, "SignUp", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        signUpTime: parseInt(user.metadata.creationAt),
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                } else {
                    logEvent(analytics, "Login", {
                        user_id: user.uid,
                        username: user.displayName,
                        email: user.email,
                        loginTime: parseInt(new Date(user.metadata.lastLoginAt)),
                        provider: user.providerData[0].providerId.split('.')[0]
                    });
                }
                navigate('/companies/list');
            }).catch((error) => {
            if (error.code === 'auth/account-exists-with-different-credential') {
                setError("You have already signed up with google with same credentials, login with google");
            } else {
                setError("try again");
            }
        });
    }

    return (
        <div className="w-100" style={{maxWidth: '400px'}}>
            <Card>
                <Card.Body>
                    <h1 className="text-center"> Login </h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Button className="btn-primary w-100 mt-4" onClick={signInWithGoogle}> Login with Google</Button>
                    <Button className="btn-primary w-100 mt-4" onClick={signInWithFacebook}> Login with
                        Facebook</Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Signup;