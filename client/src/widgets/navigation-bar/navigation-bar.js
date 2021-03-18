import React from "react";
import "./navigation-bar.css";
import Global from "../../services/global"

function previousPath(currentPath) {
  window.history.back();
}

function logOut() {
  sessionStorage.removeItem(Global["APP_KEY"]);
  window.location = "/home"
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
      <a className="col nav-link" href="/databases">
        <div>Database</div>
      </a>
      <div className="col nav-link" onClick={() => {logOut()}}>Logout</div>
    </div>
  );
}

export default NavigationBar;
