import React from "react";
import "./navigation-bar.css";

function NavigationBar(props) {
  if (props.currentPath === '/home') {
    return null;
  }
  return (

    <div id="nav-container" class="row" style={{ backgroundColor: "#1A3263" }}>
        <a class="col nav-link" href="/table" style={{ color: "#f8f9fa"}} ><div>Table</div></a>
        <a class="col nav-link" href="/databases" style={{ color: "#f8f9fa"}}><div>Database</div></a>
        <a class="col nav-link" href="/Logout" style={{ color: "#f8f9fa"}}><div>Logout</div></a>
    </div>
  )
}

export default NavigationBar;