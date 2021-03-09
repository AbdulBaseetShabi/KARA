import React from "react";

function DeletePopUp(props) {
  if (props.show) {
    return (
      <div id="delete-prompt-content" className="modal-options">
        <div className="modal-options-content">
          <label className="center-label page-label">Delete Confirmation</label>
          <hr className="header-hr" />
          <label className="center-label">
            Are you sure you want to delete this {props.delete_name}
          </label>
          <div className="row button-row">
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={
                props.loading
                  ? null
                  : () => {
                      props.deleteData();
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
              ) : (
                "Delete " + props.delete_name
              )}
            </button>
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={() => props.openModal(false)}
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

export default DeletePopUp;
