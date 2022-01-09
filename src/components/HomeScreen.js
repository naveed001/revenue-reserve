import React, { useState, useEffect, useContext } from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { UserContext, UserDispatchContext } from "../contexts/AuthContext";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


export default function HomeScreen() {

    let navigate = useNavigate();

    const userDetails = useContext(UserContext);

    const setUserDetails = useContext(UserDispatchContext);

    const { id } = useParams();

    const [companiesList, setCompaniesList] = useState([]);

    const [companiesData, setCompaniesData] = useState({});

    const [isInitialRender, setIsInitialRender] = useState(true);


    useEffect(() => {
        console.log(userDetails);
        fetchData();
    }, [isInitialRender]);

    const fetchData = async () => {
        const dataCollection = collection(db, "revenues");
        const snapshot = await getDocs(dataCollection);
        const comList = snapshot.docs.map(doc => doc.data().Company);
        setCompaniesList(comList);
        const data = {};
        snapshot.docs.map(doc => data[doc.data().Company] = doc.data());
        window.sessionStorage.setItem('companiesData', JSON.stringify(data))
        setCompaniesData(data);
        console.log(data);
    }

    const logout = () => {
        window.sessionStorage.clear();
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('Sign-out successful');
            setUserDetails({
                isLoggedIn: false,
                email: '',
                logintime: '',
                accessToken: '',
                displayName: '',
                providerId: '',
            });
        }).catch((error) => {
            console.log('An error happened');
        });
        navigate('/login');
    }
    const fetchCompanyData = () => {
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        ChartJS.register(
            CategoryScale,
            LinearScale,
            BarElement,
            Title,
            Tooltip,
            Legend
        );
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart',
                },
            },
        };

        const intValues = labels.map((month) => {
            if (companiesData !== {} && companiesData[id]){
                return parseInt((companiesData[id][month]).replace(/[^\d.-]/g, ''))
            }
        });

        const highest = Math.max(...intValues);

        const lowest = Math.min(...intValues);

        const maxRevenueMonth = intValues.reduce(function(a, e, i) {
            if (e === highest)
                a.push(i);
            return a;
        }, []).map(index => labels[index]).toLocaleString();

        const minRevenueMonth = intValues.reduce(function(a, e, i) {
            if (e === lowest)
                a.push(i);
            return a;
        }, []).map(index => labels[index]).toLocaleString();

        const average = parseFloat(intValues.reduce( ( p, c ) => p + c, 0 ) / intValues.length).toFixed(2);

        let data = {
            labels,
            datasets: [
                {
                    label: 'Revenues',
                    data: intValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };

        return (
            <>
                <div style={{display : 'grid'}}>
                    <span>{`Highest Revene : ${highest}`}</span>
                    <span>{`Lowest revenue : ${lowest}`}</span>
                    <span>{`Highest Revenue Month : ${maxRevenueMonth}`}</span>
                    <span>{` Lowest Revenue Month : ${minRevenueMonth}`}</span>
                    <span>{` Average Monthly Revenue : ${average}`}</span>
                </div>
                <div>
                    <Bar options={options} data={data} width={100} height={50}/>
                </div>
            </>
        )
    }

    const goToHome = () => {
        navigate('/companies/list');
    }


    return (
        <div>
            <div className="header">
                <button onClick={goToHome}>
                    Home
                </button>
                <button onClick={logout}>
                    Logout
                </button>
            </div>

            <div style={{display: 'inline-block', width : '800px'}}>
                {
                    id !== 'list' && companiesData[id] ?
                        <>
                            <h1>{`${id} Revenue Stats`}</h1>
                            {fetchCompanyData()}
                        </>

                        :
                        companiesList.map(company => {
                            return(<li>
                                <Link to={`/companies/${company}`}>{company}</Link>
                            </li>)
                        })
                }
            </div>
        </div>
    )
}