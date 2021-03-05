import React from "react";
import "./home.css";

function Home() {
  return (
    <div id="home-container" className="d-flex justify-content-center align-items-center">
        <div id="login-container">
            <label className="center-label" id="auth-label">Authentication Page</label>
            <hr/>
            <label className="center-label">Connection String</label>
            <input className="center-div" type="text"></input>
            <label className="center-label">User ID/Name</label>
            <input className="center-div" type="text"></input>
            <label className="center-label">Password</label>
            <input className="center-div"type="password"></input>
            <hr/>
            <div id="login-button">Login</div>
        </div>
    </div>
  );
}

export default Home;