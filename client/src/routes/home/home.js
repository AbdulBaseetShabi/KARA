import React from "react";
import "./home.css";

function Home(props) {
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
            <a href="/databases" onClick={props.changeLocation}><div id="login-button">Login</div></a>
        </div>
    </div>
  );
}

export default Home;