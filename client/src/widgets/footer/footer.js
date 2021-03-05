import React from "react";
import "./footer.css";

function Footer(props) {
  if (props.currentPath === '/home') {
    return null;
  }
  return (
    <div>Footer</div>
  );
}

export default Footer;