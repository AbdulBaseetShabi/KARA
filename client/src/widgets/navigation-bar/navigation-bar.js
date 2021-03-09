import React from "react";
import "./navigation-bar.css";

function previousPath(currentPath) {
  window.history.back();
}

function NavigationBar(props) {
  if (props.currentPath === "/home") {
    return null;
  }
  return (
    <div
      id="nav-container"
      className="row"
      style={{ backgroundColor: "#1A3263" }}
    >
      {props.currentPath !== "/databases/view" && window.history.length > 1 ? (
        <div
          className="col-1"
          onClick={() => {
            previousPath(props.currentPath);
          }}
        >
          <i id="back-arrow" className="fas fa-arrow-left fa-2x"></i>
        </div>
      ) : null}
      <a className="col nav-link" href="/table">
        <div>Table</div>
      </a>
      <a className="col nav-link" href="/databases">
        <div>Database</div>
      </a>
      <a className="col nav-link" href="/Logout">
        <div>Logout</div>
      </a>
    </div>
  );
}

export default NavigationBar;
