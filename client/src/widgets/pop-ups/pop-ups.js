import React from "react";
import "./pop-ups.css";

function PopUp(props) {
  if (props.show) {
    return (
      <div
        id="pop-up-content"
        className={props.show?"fade-in-animation":""}
        style={{
          backgroundColor:
            props.modaltype === "error"
              ? "#cc3300"
              : props.modaltype === "warning"
              ? "#ffcc00"
              : "#99cc33",
        }}
      >
        <div id="popup-message">{props.children}</div>
        <label  id="close-icon" onClick={()=>{props.closePopUp({});}}>Close  <i className="fas fa-times"></i></label>
      </div>
    );
  }

  return null;
}

export default PopUp;
