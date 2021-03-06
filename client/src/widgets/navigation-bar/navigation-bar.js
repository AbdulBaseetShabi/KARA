import React from "react";
import "./navigation-bar.css";

function NavigationBar(props) {
  if (props.currentPath === '/home') {
    return null;
  }
  return (

    <div class= "navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "#1A3263" }}>
        <a class="navbar" href="/table" style={{ color: "#f8f9fa"}} ><div>Table</div></a>
        <a class="navbar" href="/databases" style={{ color: "#f8f9fa"}}><div>Database</div></a>
        <a class="navbar" href="/Logout" style={{ color: "#f8f9fa"}}><div>Logout</div></a>
    </div>
  )
}

export default NavigationBar;