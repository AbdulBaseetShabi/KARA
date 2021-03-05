import React from "react";
import "./navigation-bar.css";

function NavigationBar(props) {
  if (props.currentPath === '/home') {
    return null;
  }
  return (
    <div>Nav Bar</div>
  );
}

export default NavigationBar;