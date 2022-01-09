import React from "react";
import {BrowserRouter as Router, useNavigate} from "react-router-dom";
import {Container} from "react-bootstrap";
import {RoutesApp} from "./Routes";
import {UserProvider} from "../contexts/contextAPI";

function App() {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
                <UserProvider>
                    <Router>
                        <RoutesApp/>
                    </Router>
                </UserProvider>
        </Container>
    );
}

export default App;
