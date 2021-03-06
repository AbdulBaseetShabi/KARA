import React from "react";
import "./footer.css";

function Footer(props) {
  let date = new Date().getUTCFullYear();
  return (
    <div id="footer-container">
      <label className="center-label" id="footer-label">Copyright © {date}, All rights reserved. Project created by Team KARA.</label>
    </div>
  );
}

export default Footer;