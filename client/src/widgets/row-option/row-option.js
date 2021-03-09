import React from "react";
import './row-option.css';

function RowOptions(props) {
  if (props.show_row_option) {
    return (
      <div id="row-options">
        <div id="row-options-content">
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
            <button className="col" type="button" style={{ margin: "0 auto" }}>
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
                return (
                  <tr key={index}>
                    <td>{props.keys[index]}</td>
                    <td>{row_option}</td>
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
            <button className="col" type="button" style={{ margin: "0 auto" }}>
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