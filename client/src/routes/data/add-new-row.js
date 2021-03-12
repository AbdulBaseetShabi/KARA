import React from "react";

function AddNewRow(props) {
  if (props.show) {
    return (
      <div className="modal-options">
        <div className="modal-options-content">
          <table>
            <thead>
              <tr>
                <th>Column name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {props.keys.map((column, index) => {
                return (
                  <tr key={index}>
                    <td>{column}</td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => {
                          props.updateAddRowValue(column, e.target.value);
                        }}
                      ></input>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="row button-row">
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={
                props.loading
                  ? null
                  : () => {
                      props.addRow();
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
                "Add Row"
              )}
            </button>

            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={() => {
                props.shouldShowAddRow(false);
              }}
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

export default AddNewRow;
