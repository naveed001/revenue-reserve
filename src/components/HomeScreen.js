import React, {useState, useEffect, useContext} from "react";
import {db} from '../firebaseConfig';
import {collection, getDocs} from 'firebase/firestore/lite';
import {useNavigate, Link, useParams} from 'react-router-dom';
import {getAuth, signOut} from "firebase/auth";
import {AuthContext} from "../contexts/contextAPI";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {Button, Card} from "react-bootstrap";


export default function HomeScreen() {

    let navigate = useNavigate();

    const {currentUser} = useContext(AuthContext);

    const {id} = useParams();

    const [companiesList, setCompaniesList] = useState([]);

    const [companiesData, setCompaniesData] = useState({});

    const [isInitialRender, setIsInitialRender] = useState(true);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchData();
    }, [isInitialRender]);

    const fetchData = () => {
        const dataCollection = collection(db, "revenues");
        getDocs(dataCollection).then(
            snapshot => {
                const comList = snapshot.docs.map(doc => doc.data().Company);
                setCompaniesList(comList);
                const data = {};
                snapshot.docs.map(doc => data[doc.data().Company] = doc.data());
                setCompaniesData(data);
                console.log(data);
                setLoading(false);
            }
        );

    }

    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('Sign-out successful');
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
            if (companiesData !== {} && companiesData[id]) {
                return parseInt((companiesData[id][month]).replace(/[^\d.-]/g, ''))
            }
        });

        const highest = Math.max(...intValues);

        const lowest = Math.min(...intValues);

        const maxRevenueMonth = intValues.reduce(function (a, e, i) {
            if (e === highest)
                a.push(i);
            return a;
        }, []).map(index => labels[index]).toLocaleString();

        const minRevenueMonth = intValues.reduce(function (a, e, i) {
            if (e === lowest)
                a.push(i);
            return a;
        }, []).map(index => labels[index]).toLocaleString();

        const average = parseFloat(intValues.reduce((p, c) => p + c, 0) / intValues.length).toFixed(2);

        const country = companiesData[id]['Country'];

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
        if (loading) {
            return <>Loading...</>
        }

        return (
            <>
                <div style={{display: 'grid'}}>
                    <span>{`Based at : ${country}`}</span>
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
        navigate('/companies');
    }


    return (
        <div>
            <Card>
                <Card.Body>
                    {!companiesData[id] && !loading && <h1> Companies List</h1>}
                    <div className="header">
                        <Button onClick={goToHome} style={{position: 'fixed', top: '10px', left: '10px'}}>
                            Home
                        </Button>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            position: 'fixed',
                            top: '10px',
                            right: '10px'
                        }}>
                            <div className="mr-2"> Signed in as: <b>{currentUser.displayName}</b> <span> <img
                                src={currentUser.photoURL} style={{width: '30px', borderRadius: '30px'}}/></span></div>
                            <Button onClick={logout}>
                                Logout
                            </Button>
                        </div>

                    </div>
                    <div style={{display: 'inline-block', width: '800px'}}>
                        {
                            companiesData[id] ?
                                <>
                                    <h1>{`${id} Revenue Stats`}</h1>
                                    {fetchCompanyData()}
                                </>
                                :
                                companiesList.map(company => {
                                    return (<li>
                                        <Link to={`/companies/${company}`}>{company}</Link>
                                    </li>)
                                })
                        }
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}