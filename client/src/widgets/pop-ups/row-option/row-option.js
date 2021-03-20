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
              onClick={() => {
                props.saveChanges();
              }}
            >
              Save Changes
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
                <th>Column name</th>
                <th>Old Value</th>
                <th>New Value</th>
              </tr>
            </thead>
            <tbody>
              {props.row_options.map((row_option, index) => {
                let modified_row_option = row_option === null ? "NULL" : row_option;
                modified_row_option = modified_row_option.toString().trim();
                modified_row_option = modified_row_option.length > 0 ? modified_row_option : "Empty String";
                
                return (
                  <tr key={index}>
                    <td>{props.keys[index]}</td>
                    <td>{modified_row_option}</td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => {
                          props.updateRowValue(
                            index,
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
              onClick={() => {
                props.saveChanges();
              }}
            >
              Save Changes
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
