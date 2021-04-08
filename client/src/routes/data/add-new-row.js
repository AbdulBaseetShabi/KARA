import React from "react";

function AddNewRow(props) {
  if (props.show) {
    return (
      <div className="modal-options">
        <div className="modal-options-content">
          <table>
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Size</th>
                <th>Column name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {props.keys.map((column, index) => {
                let data_type = props.data_type[column];
                let type = data_type['type']
                let size = data_type['size']
                return (
                  <tr key={index}>
                    <td>{type}</td>
                    <td>{type === 'str' && size !== 2147483647 ? size : "N/A"}</td>
                    <td>{column}</td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => {
                          props.updateAddRowValue(column, data_type, e.target.value);
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
