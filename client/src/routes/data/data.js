import React from "react";
import "./data.css";

const mock_data = [
  {
    id: 1,
    first_name: "Abdul",
    last_name: "Shabi",
    date_of_birth: new Date().toLocaleDateString(),
    married: true,
  },
  {
    id: 2,
    first_name: "Test",
    last_name: "User",
    date_of_birth: new Date().toLocaleDateString(),
    married: false,
  },
  {
    id: 3,
    first_name: "Trink",
    last_name: "Trank",
    date_of_birth: new Date().toLocaleDateString(),
    married: true,
  },
  {
    id: 4,
    first_name: "Ting",
    last_name: "Tang",
    date_of_birth: new Date().toLocaleDateString(),
    married: false,
  },
];

function convertObjectToArray(data) {
  let keys = Object.keys(data[0]);
  let array_data = data.map((a) => {
    let array = [];
    for (let i = 0; i < keys.length; i++) {
      array.push(a[keys[i]].toString());
    }
    return array;
  });
  let return_value = {
    keys: keys,
    data: array_data,
  };

  return return_value;
}

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_row_option: true,
      row_options: [],
    };
    this.new_row_values = [];
    this.keys = [];
    this.data = [];
    this.edit_row_number = null;
  }

  shouldShowRowOptions(row, boolean, edit_row_number) {
    if (!boolean) {
      this.new_row_values = [];
    } else {
      for (let i = 0; i < this.keys.length; i++) {
        this.new_row_values.push({
          column_name: this.keys[i],
          old_value: "",
          new_value: "",
        });
      }
    }

    this.edit_row_number = edit_row_number;
    this.setState({ row_options: row, show_row_option: boolean });
  }

  updateRowValue(index, oldValue, newValue) {
    this.new_row_values[index]["old_value"] = oldValue;
    this.new_row_values[index]["new_value"] = newValue;
  }

  saveChanges() {
    this.new_row_values = this.new_row_values.map((row) => {
      if (row["old_value"].length === 0 && row["new_value"].length === 0) {
        let index = this.keys.indexOf(row["column_name"]);
        let old_value = this.data[this.edit_row_number][index];
        let value = {
          column_name: row["column_name"],
          old_value: old_value,
          new_value: old_value,
        };
        return value;
      } else {
        return row;
      }
    });
    console.log(this.new_row_values);
    this.shouldShowRowOptions([], false, null);
  }

  render() {
    let data = convertObjectToArray(mock_data);
    this.keys = data["keys"];
    this.data = data["data"];

    return (
      <div id="data-container">
        <label className="center-label page-label">
          Data in the <span id="db-name-selected">Trivia</span> Table in the
          <span id="db-name-selected">Trivia</span> database
        </label>
        <hr className="header-hr" />
        <table>
          <thead>
            <tr>
              {this.keys.map((key, index) => {
                return <th key={index}>{key}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.data.map((row, i) => {
              return (
                <tr
                  key={i}
                  onClick={() => {
                    this.shouldShowRowOptions(row, true, i);
                  }}
                >
                  {row.map((row_data, index) => {
                    return <td key={index}>{row_data}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {(() => {
          if (this.state.show_row_option) {
            return (
              <div id="row-options">
                <div id="row-options-content">
                  <div className="row button-row">
                    <button
                      className="col"
                      type="button"
                      style={{ margin: "0 auto" }}
                      onClick={() => {
                        this.saveChanges();
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      className="col"
                      type="button"
                      style={{ margin: "0 auto" }}
                    >
                      Delete
                    </button>
                    <button
                      className="col"
                      type="button"
                      style={{ margin: "0 auto" }}
                      onClick={() => {
                        this.shouldShowRowOptions([], false);
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
                      {this.state.row_options.map((row_option, index) => {
                        return (
                          <tr key={index}>
                            <td>{this.keys[index]}</td>
                            <td>{row_option}</td>
                            <td>
                              <input
                                type="text"
                                onChange={(e) => {
                                  this.updateRowValue(
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
                        this.saveChanges();
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      className="col"
                      type="button"
                      style={{ margin: "0 auto" }}
                    >
                      Delete
                    </button>
                    <button
                      className="col"
                      type="button"
                      style={{ margin: "0 auto" }}
                      onClick={() => {
                        this.shouldShowRowOptions([], false);
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
        })()}
      </div>
    );
  }
}

export default Data;
