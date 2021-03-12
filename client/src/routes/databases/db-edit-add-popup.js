import React from "react";

function AddDB(props) {
  if (props.show) {
    return (
      <div className="modal-options">
        <div className="modal-options-content">
          <label className="center-label page-label">{props.is_add_new_db ? "Add New Database" : "Change Database Name"}</label>
          <hr className="header-hr" />
          <label className="metadata-label center-label">
            Database Name{props.is_add_new_db ? "" : ": " + props.old_name}
          </label>
          <input
            type="text"
            style={{ marginBottom: "10px" }}
            onChange={(e) => {
              let value = e.target.value.trim();
              if (props.is_add_new_db) {
                props.controlCreateNewDatabase(value);
              } else {
                props.controlChangeDataBaseName(value);
              }
            }}
          ></input>
          <div className="row button-row">
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={
                props.loading
                  ? null
                  : () => {
                      if (props.is_add_new_db) {
                        props.createNewDatabase();
                      } else {
                        props.changeDataBaseName(props.old_name);
                      }
                    }
              }
            >
              {props.loading ? (
                <label style={{ paddingTop: "7px" }}>
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                    style={{ margin: "0 5px 3.5px 0px" }}
                  ></span>
                  Loading
                </label>
              ) : props.is_add_new_db ? (
                "Create Database"
              ) : (
                "Change Name"
              )}
            </button>
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={() => props.openModal(false, false, "")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default AddDB;
