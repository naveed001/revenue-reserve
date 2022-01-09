import  React from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import {Container} from "react-bootstrap";
import {RoutesApp} from "./Routes";
import {UserProvider} from "../contexts/AuthContext";

function App() {
  return (
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight : "100vh"}}>
        <div className="w-100" style={{maxWidth : "400px"}}>
            <Router>
                <UserProvider>
                    <RoutesApp/>
                </UserProvider>
            </Router>
        </div>
      </Container>
  );
}

export default App;
