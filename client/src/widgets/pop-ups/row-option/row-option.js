import React from "react";
import "./row-option.css";

function RowOptions(props) {
  if (props.show_row_option) {
    return (
      <div className="modal-options">
        <div className="modal-options-content">
          <div className="row button-row">
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={
                props.loading
                  ? null
                  : () => {
                      props.saveChanges();
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
                "Save Changes"
              )}
            </button>
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={() => {
                props.openDeleteModal(true);
              }}
            >
              Delete
            </button>
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={() => {
                props.shouldShowRowOptions([], false);
              }}
            >
              Cancel
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Size</th>
                <th>Column name</th>
                <th>Old Value</th>
                <th>New Value</th>
              </tr>
            </thead>
            <tbody>
              {props.row_options.map((row_option, index) => {
                let modified_row_option =
                  row_option === null ? "NULL" : row_option;
                modified_row_option = modified_row_option.toString().trim();
                modified_row_option =
                  modified_row_option.length > 0
                    ? modified_row_option
                    : "Empty String";
                let data_type = props.data_type[props.keys[index]];
                let type = data_type['type']
                let size = data_type['size']
                return (
                  <tr key={index}>
                    <td>{type}</td>
                    <td>{type === 'str' && size !== 2147483647 ? size : "N/A"}</td>
                    <td>{props.keys[index]}</td>
                    <td>{modified_row_option}</td>
                    <td>
                      <input
                        type= "text"
                        onChange={(e) => {
                          props.updateRowValue(
                            index,
                            data_type,
                            row_option,
                            e.target.value
                          );
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
                      props.saveChanges();
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
                "Save Changes"
              )}
            </button>
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={() => {
                props.openDeleteModal(true);
              }}
            >
              Delete
            </button>
            <button
              className="col"
              type="button"
              style={{ margin: "0 auto" }}
              onClick={() => {
                props.shouldShowRowOptions([], false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default RowOptions;
