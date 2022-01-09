import {initializeApp} from 'firebase/app';
import {getAuth} from "firebase/auth";
import {getFirestore} from 'firebase/firestore/lite';
import {getAnalytics} from 'firebase/analytics';

export const firebaseConfig = {
    apiKey: "AIzaSyCyYeZypSZ0g0Q2e6F78-qRonx53gOX7Kg",
    authDomain: "revenuereserve-98269.firebaseapp.com",
    databaseURL: "https://revenuereserve-98269-default-rtdb.firebaseio.com",
    projectId: "revenuereserve-98269",
    storageBucket: "revenuereserve-98269.appspot.com",
    messagingSenderId: "591312337167",
    appId: "1:591312337167:web:62697a97f4d306d8b8267a",
    measurementId: "G-NC2WWHV3D3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();

